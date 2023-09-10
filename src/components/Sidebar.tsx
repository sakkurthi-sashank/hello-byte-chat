import { Button, Navbar, Stack } from '@mantine/core'
import { signOut } from 'firebase/auth'
import { auth } from '../libs/firebase'
import { AcceptFriendRequest } from './AcceptFriendRequest'
import { AddFriend } from './AddFriend'
import { FriendList } from './FriendList'

export const Sidebar = () => {
  return (
    <>
      <Navbar.Section grow>
        <FriendList />
      </Navbar.Section>
      <Navbar.Section>
        <AcceptFriendRequest />
      </Navbar.Section>
      <Navbar.Section>
        <Stack spacing="xs" mb="xs">
          <AddFriend />
          <Button
            fullWidth
            variant="filled"
            color="red"
            size="xs"
            fw={500}
            onClick={() => signOut(auth)}
          >
            Logout
          </Button>
        </Stack>
      </Navbar.Section>
    </>
  )
}
