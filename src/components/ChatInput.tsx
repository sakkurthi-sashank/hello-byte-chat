import { ActionIcon, Box, TextInput, useMantineTheme } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'

export const ChatInput = ({ ...props }) => {
  const theme = useMantineTheme()

  return (
    <Box
      className="flex h-20 w-full items-center justify-center bg-white px-4"
      sx={{
        borderTop: `1px solid ${theme.colors.gray[2]}`,
      }}
    >
      <TextInput
        radius="xl"
        className="w-full"
        size="md"
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            color={theme.primaryColor}
            variant="filled"
          >
            <IconArrowRight size="1.1rem" stroke={1.5} />
          </ActionIcon>
        }
        placeholder="Type your message..."
        rightSectionWidth={42}
        {...props}
      />
    </Box>
  )
}
