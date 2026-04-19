import { BookingWizard } from '../../components/ui/BookingWizard'
import { ReceiptUploader } from '../../components/ui/ReceiptUploader'

export function BookingPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <BookingWizard />
      <div className="mt-8">
        <ReceiptUploader />
      </div>
    </section>
  )
}
