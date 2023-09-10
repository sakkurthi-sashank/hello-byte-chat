import { ActionIcon, Box, TextInput, useMantineTheme } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { userContext, userSelectedFriendIdContext } from '../context/context'
import { db } from '../libs/firebase'

export const ChatInput = () => {
  const theme = useMantineTheme()
  const [message, setMessage] = useState('')
  const user = useContext(userContext)
  const userSelectedFriendId = useContext(userSelectedFriendIdContext)

  const sendMessage = async () => {
    const messageRef = collection(db, 'messages')
    await addDoc(messageRef, {
      profileURL: user?.photoURL,
      content: message,
      timestamp: serverTimestamp(),
      senderId: user?.uid,
      receiverId: userSelectedFriendId?.userSelectedFriendId,
    }).then(() => {
      setMessage('')
    })
  }

  return (
    <Box
      className="flex h-20 w-full items-center justify-center bg-white px-4"
      sx={{
        borderTop: `1px solid ${theme.colors.gray[2]}`,
      }}
    >
      <form
        className="w-full flex items-center justify-center"
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage()
        }}
      >
        <TextInput
          radius="xl"
          className="w-full"
          size="md"
          value={message}
          rightSection={
            <ActionIcon
              size={32}
              radius="xl"
              type="submit"
              color={theme.primaryColor}
              variant="filled"
            >
              <IconArrowRight size="1.1rem" stroke={1.5} />
            </ActionIcon>
          }
          placeholder="Type your message..."
          rightSectionWidth={42}
          onChange={(e) => setMessage(e.currentTarget.value)}
        />
      </form>
    </Box>
  )
}
