import {
  ActionIcon,
  Box,
  FileButton,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import { IconArrowRight, IconPaperclip } from '@tabler/icons-react'
import {} from 'file-type'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { userContext, userSelectedFriendIdContext } from '../context/context'
import { db, storage } from '../libs/firebase'

function getExtension(fileName: string) {
  const parts = fileName.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

export const ChatInput = () => {
  const theme = useMantineTheme()
  const [message, setMessage] = useState('')
  const user = useContext(userContext)
  const userSelectedFriendId = useContext(userSelectedFriendIdContext)
  const [file, setFile] = useState<File | null>(null)

  const sendMessage = async () => {
    const messageRef = collection(db, 'messages')

    if (file) {
      const storageRef = ref(storage, `images/${uuidv4()}`)
      await uploadBytes(storageRef, file as any).then((snapshot) => {
        console.log('Uploaded a blob or file!')
      })
      const url = await getDownloadURL(storageRef)

      await addDoc(messageRef, {
        profileURL: user?.photoURL,
        content: message,
        timestamp: serverTimestamp(),
        imageURL: url,
        fileType: getExtension(file?.name),
        senderId: user?.uid,
        receiverId: userSelectedFriendId?.userSelectedFriendId,
      }).then(() => {
        setMessage('')
        file && setFile(null)
      })
    } else {
      await addDoc(messageRef, {
        profileURL: user?.photoURL,
        content: message,
        timestamp: serverTimestamp(),

        senderId: user?.uid,
        receiverId: userSelectedFriendId?.userSelectedFriendId,
      }).then(() => {
        setMessage('')
        file && setFile(null)
      })
    }
  }

  return (
    <Box
      className="flex h-20 w-full items-center justify-center bg-white px-4"
      sx={{
        borderTop: `1px solid ${theme.colors.gray[2]}`,
      }}
    >
      <form
        className="w-full flex items-center justify-center space-x-3"
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage()
        }}
      >
        <FileButton onChange={setFile}>
          {(props) => (
            <ActionIcon
              size={'lg'}
              color={theme.primaryColor}
              {...props}
              variant="filled"
            >
              <IconPaperclip size="1.1rem" stroke={1.5} />
            </ActionIcon>
          )}
        </FileButton>

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
