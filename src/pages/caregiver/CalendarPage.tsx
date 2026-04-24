import { caregivers, calendarDaysByCaregiver } from '../../services/mockData'
import { MonthAvailabilityCalendar } from '../../components/ui/MonthAvailabilityCalendar'

export function CalendarPage() {
  const profile = caregivers[2]
  return (
    <MonthAvailabilityCalendar
      title={`Calendario mensual de ${profile.name}`}
      days={calendarDaysByCaregiver[profile.id]}
    />
  )
}
