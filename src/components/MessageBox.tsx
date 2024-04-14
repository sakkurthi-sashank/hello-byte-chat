import { ActionIcon, Avatar, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconFileText, IconTrash } from '@tabler/icons-react'
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
  imageURL?: string
  senderId: string
  fileType?: string
  timestamp: {
    toDate: () => Date
  }
}

export function MessageBox() {
  const currentUser = useContext(userContext)
  const selectedFriendId = useContext(userSelectedFriendIdContext)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[] | null>(null)
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const DispalyMediaContent = ({
    fileType,
    imageURL,
  }: {
    fileType: string
    imageURL: string
  }) => {
    if (fileType.toUpperCase() === 'MP4' || fileType.toUpperCase() === 'HEVC') {
      return (
        <video controls className="w-60 h-60 rounded-md mt-2">
          <source src={imageURL} type="video/mp4" />
        </video>
      )
    } else if (
      fileType.toUpperCase() === 'png'.toUpperCase() ||
      fileType.toUpperCase() === 'jpg'.toUpperCase() ||
      fileType.toUpperCase() === 'jpeg'.toUpperCase()
    ) {
      return (
        <>
          <img
            onClick={
              imageURL
                ? () => {
                    setSelectedImage(imageURL)
                    open()
                  }
                : undefined
            }
            src={imageURL}
            alt="message"
            className="w-60 h-60 rounded-md mt-2"
          />
          <Modal size="auto" opened={opened} onClose={close}>
            <img alt="message" width={500} height={500} src={selectedImage!} />
          </Modal>
        </>
      )
    } else {
      return (
        <a href={imageURL} target='_blank' download>
          <div className="bg-gray-100 h-40 w-40 rounded-md mt-2 flex items-center justify-center">
            <IconFileText size={40} />
          </div>
        </a>
      )
    }
  }

  const formatTimestamp = (timestamp: Date): string => {
    return timestamp.toLocaleString('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  useEffect(() => {
    if (!currentUser?.uid || !selectedFriendId?.userSelectedFriendId) return

    const fetchMessages = async () => {
      const messageCollection = collection(db, 'messages')

      const messageQuery = query(
        messageCollection,
        or(
          and(
            where('senderId', '==', currentUser?.uid),
            where('receiverId', '==', selectedFriendId?.userSelectedFriendId),
          ),
          and(
            where('senderId', '==', selectedFriendId?.userSelectedFriendId),
            where('receiverId', '==', currentUser?.uid),
          ),
        ),
      )

      const messageData = onSnapshot(messageQuery, (snapshot) => {
        const sortedMessages = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            content: doc.data().content,
            senderId: doc.data().senderId,
            timestamp: doc.data().timestamp,
            profileURL: doc.data().profileURL,
            fileType: doc.data().fileType,
            imageURL: doc.data().imageURL,
          }))
          .sort((a, b) => a.timestamp.toDate() - b.timestamp.toDate())

        setMessages(sortedMessages)
      })

      return messageData
    }

    fetchMessages()
  }, [currentUser?.uid, selectedFriendId?.userSelectedFriendId])

  const deleteMessage = async (messageId: string) => {
    deleteDoc(doc(db, 'messages', messageId))
  }

  return (
    <div className="flex flex-col h-full w-full p-4">
      {messages?.map((message, index) => (
        <div
          key={index}
          className="flex flex-col w-full justify-center"
          style={{
            alignItems:
              message.senderId === currentUser?.uid ? 'flex-end' : 'flex-start',
          }}
          onMouseEnter={() => setHoveredMessageId(message.id)}
          onMouseLeave={() => setHoveredMessageId(null)}
        >
          <div
            className="flex cursor-pointer flex-row items-center justify-center"
            style={{
              flexDirection:
                message.senderId === currentUser?.uid ? 'row-reverse' : 'row',
            }}
          >
            <Avatar src={message.profileURL} size={'md'} radius={'md'} />
            <div className="bg-white rounded-lg px-4 py-2 m-4 h-fit w-fit border border-gray-100 shadow">
              <div className="text-gray-700">{message.content}</div>
              <div className="text-xs text-gray-500 text-end">
                {message.timestamp &&
                  formatTimestamp(message.timestamp.toDate())}
              </div>
              {message.imageURL && (
                <DispalyMediaContent
                  fileType={message.fileType!}
                  imageURL={message.imageURL!}
                />
              )}
            </div>
            {hoveredMessageId === message.id &&
              currentUser?.uid === message.senderId && (
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
