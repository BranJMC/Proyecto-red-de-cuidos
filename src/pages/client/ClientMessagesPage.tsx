import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChatLayout } from '../../components/ui/ChatLayout'
import { useToast } from '../../hooks/useToast'
import { useSocket } from '../../hooks/useSocket'
import { mockApi } from '../../services/api'
import { useAppStore } from '../../store/useAppStore'
import type { MessageThread } from '../../types'

export function ClientMessagesPage() {
  useSocket('chat')
  const [searchParams] = useSearchParams()
  const [threads, setThreads] = useState<MessageThread[]>([])
  const user = useAppStore((state) => state.user)
  const toast = useToast()

  useEffect(() => {
    if (!user.id) {
      return
    }

    mockApi.getThreadsByUser(user.id).then(setThreads)
  }, [user.id])

  return (
    <ChatLayout
      threads={threads}
      initialThreadId={searchParams.get('thread')}
      onSendMessage={async ({ conversationId, content }) => {
        if (!user.id) {
          return
        }

        try {
          await mockApi.sendMessage({ conversationId, senderId: user.id, content })
          setThreads(await mockApi.getThreadsByUser(user.id))
        } catch {
          toast.error('No se pudo enviar', 'El mensaje no pudo guardarse en la base de datos.')
        }
      }}
    />
  )
}
