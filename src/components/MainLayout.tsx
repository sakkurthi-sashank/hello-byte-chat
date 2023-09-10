import {
  AppShell,
  Avatar,
  Burger,
  Group,
  Header,
  Image,
  MediaQuery,
  Navbar,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core'
import { useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { userContext } from '../context/userContext'
import { ChatInput } from './ChatInput'
import { Sidebar } from './Sidebar'

export default function MainLayout() {
  const user = useContext(userContext)
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      padding={0}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="xs"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ base: 300 }}
        >
          <Sidebar />
        </Navbar>
      }
      header={
        <Header height={{ base: 55 }} p="md">
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <div className="flex h-full w-full items-center justify-between">
              <Image
                src={'/stream-chat.svg'}
                width={'auto'}
                height={18}
                alt={'Stream Chat Logo'}
              />
              <UnstyledButton>
                <Group>
                  <Avatar
                    src={user?.photoURL || ''}
                    size={'md'}
                    radius={'md'}
                  />
                  <div className="hidden sm:block">
                    <Text size={'xs'} color="dark">
                      {user?.displayName}
                    </Text>
                    <Text size={'xs'} color="gray">
                      {user?.email}
                    </Text>
                  </div>
                </Group>
              </UnstyledButton>
            </div>
          </div>
        </Header>
      }
    >
      <div className="background-pattern flex h-full w-full flex-col">
        <div className="flex h-full w-full">
          <Outlet />
        </div>
        <ChatInput />
      </div>
    </AppShell>
  )
}
