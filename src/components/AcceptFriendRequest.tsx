import {
  ActionIcon,
  Avatar,
  Divider,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import {
  DocumentData,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { useContext, useEffect, useState } from 'react'
import { userContext } from '../context/context'
import { db } from '../libs/firebase'

export const AcceptFriendRequest = () => {
  const [friends, setFriends] = useState<DocumentData>([])
  const user = useContext(userContext)
  const theme = useMantineTheme()

  useEffect(() => {
    const friendsCollection = collection(db, 'users', user?.uid!, 'friends')
    const collectAcceptedFriend = query(
      friendsCollection,
      where('status', '==', 'pending'),
    )

    const unsubscribe = onSnapshot(collectAcceptedFriend, (snapshot) => {
      const friendsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }))
      setFriends(friendsData)
    })

    return () => unsubscribe()
  }, [user])

  const handleAcceptFriendRequest = async (friendUserId: string) => {
    const friendDocumentRef = doc(
      db,
      'users',
      user?.uid!,
      'friends',
      friendUserId,
    )

    await updateDoc(friendDocumentRef, {
      status: 'accepted',
    })
  }

  return (
    <div className="flex flex-col">
      {friends.map(
        (friend: {
          uid: string
          displayName: string
          email: string
          photoURL: string
        }) => (
          <div key={friend.uid} className="w-full">
            <UnstyledButton className="flex w-full flex-col items-start justify-center rounded-md p-3">
              <div className="flex items-center justify-center space-x-3">
                <Avatar src={friend.photoURL} size={'md'} radius={'md'} />
                <div className="w-40">
                  <Text size={'xs'} color="dark" truncate>
                    {friend.displayName}
                  </Text>
                  <Text size={'xs'} color="gray" truncate>
                    {friend.email}
                  </Text>
                </div>
                <ActionIcon
                  color="red"
                  variant="light"
                  radius="md"
                  onClick={() => handleAcceptFriendRequest(friend.uid)}
                >
                  <IconCheck size={18} />
                </ActionIcon>
              </div>
            </UnstyledButton>
            <Divider color={theme.colors.gray[2]} />
          </div>
        ),
      )}
    </div>
  )
}
