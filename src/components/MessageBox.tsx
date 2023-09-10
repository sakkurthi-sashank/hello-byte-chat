import { ActionIcon, Avatar } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import {
  and,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  or,
  query,
  where,
} from 'firebase/firestore'
import { useContext, useEffect, useState } from 'react'
import { userContext, userSelectedFriendIdContext } from '../context/context'
import { db } from '../libs/firebase'

interface Message {
  id: string
  profileURL: string
  content: string
  senderId: string
  timestamp: {
    toDate: () => Date
  }
}

export const MessageBox: React.FC = () => {
  const user = useContext(userContext)
  const userSelectedFriendId = useContext(userSelectedFriendIdContext)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[] | null>(null)

  const formatMessageDate = (timestamp: Date): string => {
    return timestamp.toLocaleString('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  useEffect(() => {
    if (!user?.uid || !userSelectedFriendId?.userSelectedFriendId) return

    const getMessages = async () => {
      const messageCollection = collection(db, 'messages')

      const queryMessages = query(
        messageCollection,
        or(
          and(
            where('senderId', '==', user?.uid),
            where(
              'receiverId',
              '==',
              userSelectedFriendId?.userSelectedFriendId,
            ),
          ),
          and(
            where('senderId', '==', userSelectedFriendId?.userSelectedFriendId),
            where('receiverId', '==', user?.uid),
          ),
        ),
      )

      const messageData = onSnapshot(queryMessages, (snapshot) => {
        const messages = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            content: doc.data().content,
            senderId: doc.data().senderId,
            timestamp: doc.data().timestamp,
            profileURL: doc.data().profileURL,
          }))
          .sort((a, b) => {
            return (
              a.timestamp.toDate().getTime() - b.timestamp.toDate().getTime()
            )
          })

        console.log(messages)
        setMessages(messages)
      })

      return messageData
    }

    getMessages()
  }, [user?.uid, userSelectedFriendId?.userSelectedFriendId])

  const deleteMessage = async (messageId: string) => {
    deleteDoc(doc(db, 'messages', messageId))
  }

  return (
    <div className="flex flex-col h-full w-full p-4">
      {messages?.map((message, index) => (
        <div
          key={index}
          className={`flex flex-col w-full justify-center`}
          style={{
            alignItems:
              message.senderId === user?.uid ? 'flex-end' : 'flex-start',
          }}
          onMouseEnter={() => setHoveredMessageId(message.id)}
          onMouseLeave={() => setHoveredMessageId(null)}
        >
          <div
            className="flex cursor-pointer flex-row items-center justify-center"
            style={{
              flexDirection:
                message.senderId === user?.uid ? 'row-reverse' : 'row',
            }}
          >
            <Avatar src={message.profileURL} size={'md'} radius={'md'} />
            <div className="bg-white rounded-lg px-4 py-2 m-4 h-fit w-fit border border-gray-100 shadow">
              <div className="text-gray-700">{message.content}</div>
              <div className="text-xs text-gray-500 text-end">
                {message.timestamp
                  ? formatMessageDate(message.timestamp.toDate())
                  : ''}
              </div>
            </div>
            {hoveredMessageId === message.id && (
              <ActionIcon
                size="xs"
                variant="light"
                color="gray"
                onClick={() => deleteMessage(message.id)}
              >
                <IconTrash />
              </ActionIcon>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
