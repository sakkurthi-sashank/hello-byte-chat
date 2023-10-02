import {
  Avatar,
  Divider,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import {
  DocumentData,
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import { useContext, useEffect, useState } from 'react'
import {
  userContext,
  userSelectedFriendDataContex,
  userSelectedFriendIdContext,
} from '../context/context'
import { db } from '../libs/firebase'

export const FriendList = () => {
  const [friends, setFriends] = useState<DocumentData[] | null>(null)
  const theme = useMantineTheme()
  const user = useContext(userContext)
  const userSelectedFriendId = useContext(userSelectedFriendIdContext)
  const userSelectedFriendData = useContext(userSelectedFriendDataContex)

  useEffect(() => {
    const userId = user?.uid

    if (!userId) return

    const friendsCollection = collection(db, 'users', userId, 'friends')
    const collectAcceptedFriend = query(
      friendsCollection,
      where('status', '==', 'accepted'),
    )

    onSnapshot(collectAcceptedFriend, (snapshot) => {
      const friendsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        uid: doc.id,
      }))
      setFriends(friendsData)
    })
  }, [])

  return (
    <div className="flex flex-col">
      {friends?.map((friend) => (
        <div key={friend.email} className="w-full">
          <UnstyledButton
            className="flex w-full flex-col items-start justify-center rounded-md p-3 hover:bg-gray-100"
            onClick={() => {
              userSelectedFriendId?.setUserSelectedFriendId(friend.uid)
              userSelectedFriendData.setUserSelectedFriendData({
                displayName: friend.displayName,
                email: friend.email,
                photoURL: friend.photoURL,
              })
            }}
          >
            <div className="flex items-center justify-center space-x-3">
              <Avatar src={friend.photoURL} size={'md'} radius={'md'} />
              <div className="w-48">
                <Text size={'xs'} color="dark" truncate>
                  {friend.displayName}
                </Text>
                <Text size={'xs'} color="gray" truncate>
                  {friend.email}
                </Text>
              </div>
            </div>
          </UnstyledButton>
          <Divider color={theme.colors.gray[2]} />
        </div>
      ))}
    </div>
  )
}
