import { activeShift, hourlyServiceUpdates, messageThreads } from '../../services/mockData'
import { ChatLayout } from '../../components/ui/ChatLayout'
import { useSocket } from '../../hooks/useSocket'

export function CaregiverMessagesPage() {
  useSocket('chat')
  return <ChatLayout threads={messageThreads} shiftLog={activeShift} hourlyUpdates={hourlyServiceUpdates} />
}
