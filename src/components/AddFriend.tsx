import { Button, Modal, Stack, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { useContext, useState } from 'react'
import { userContext } from '../context/context'
import { db } from '../libs/firebase'

export function AddFriend() {
  const [isModalOpen, { open: openModal, close: closeModal }] =
    useDisclosure(false)
  const user = useContext(userContext)
  const [friendEmail, setFriendEmail] = useState('')
  const [error, setError] = useState('')

  const handleAddFriend = async () => {
    const usersCollectionRef = collection(db, 'users')
    const userQuery = query(
      usersCollectionRef,
      where('email', '==', friendEmail),
    )

    try {
      const querySnapshot = await getDocs(userQuery)

      if (!querySnapshot.empty) {
        const friendUserData = querySnapshot.docs[0].data()
        const currentUserId = user?.uid!

        const friendDocumentRef = doc(
          db,
          'users',
          currentUserId,
          'friends',
          querySnapshot.docs[0].id,
        )

        const newFriendData = {
          email: friendUserData.email,
          displayName: friendUserData.displayName,
          photoURL: friendUserData.photoURL,
          status: 'accepted',
        }

        await setDoc(friendDocumentRef, newFriendData).then(() => {
          const reverseFriendDocumentRef = doc(
            db,
            'users',
            querySnapshot.docs[0].id,
            'friends',
            currentUserId,
          )

          const reverseFriendData = {
            email: user?.email,
            displayName: user?.displayName,
            photoURL: user?.photoURL,
            status: 'pending',
          }

          setDoc(reverseFriendDocumentRef, reverseFriendData).then(() => {
            console.log('Friend added successfully!')
            closeModal()
          })
        })
      } else {
        setError('No user found with that email address.')
      }
    } catch (error) {
      setError('There was an error adding your friend. Please try again later.')
    }
  }

  return (
    <>
      <Button
        fullWidth
        variant="filled"
        color="indigo"
        size="xs"
        fw={500}
        onClick={openModal}
      >
        Add Friend
      </Button>
      <Modal opened={isModalOpen} onClose={closeModal} title="Add Friend">
        <Stack spacing="xs" mb="xs">
          <TextInput
            placeholder="Enter Friend's Email Address"
            value={friendEmail}
            onChange={(e) => setFriendEmail(e.currentTarget.value)}
            error={error}
          />
          <Button
            fullWidth
            variant="filled"
            color="indigo"
            size="xs"
            fw={500}
            onClick={handleAddFriend}
          >
            Confirm
          </Button>
        </Stack>
      </Modal>
    </>
  )
}
