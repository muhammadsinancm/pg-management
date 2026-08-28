interface BookingSummaryProps {
    totalBookings: number
    confirmedBookings: number
    checkedInBookings: number
    pendingBookings: number
}

export function BookingSummary({totalBookings, confirmedBookings, checkedInBookings, pendingBookings}: BookingSummaryProps) {
    const cards = [
        {
            label: 'Total Bookings',
            value: totalBookings
        },
        {
            label: 'Confirmed',
            value: confirmedBookings,
        },
        {
            label: 'Checked In',
            value: checkedInBookings
        },
        {
            label: 'Pending',
            value: pendingBookings
        }
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-200 bg-white p-5"
        >
          <p className="text-sm text-gray-500">
            {card.label}
          </p>

          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {card.value}
          </p>
        </div>
      ))}
    </div>
    )

}