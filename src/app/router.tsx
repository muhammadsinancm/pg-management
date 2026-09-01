import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardShell } from '@/features/dashboard/components/DashboardShell'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoomDetailsPage } from '@/features/pg/rooms/pages/RoomDetailsPage'
import { PaymentDetailsPage } from '@/features/pg/payments/pages/PaymentDetailsPage'
import { PaymentCreatePage } from '@/features/pg/payments/pages/PaymentCreatePage'
import { PaymentsPage } from '@/features/pg/payments/pages/PaymentsPage'
import { ReceiptPage } from '@/features/pg/payments/pages/ReceiptPage'
import { BookingsPage } from '@/features/pg/bookings/components/BookingsPage'
import { BookingDetailsPage } from '@/features/pg/bookings/pages/BookingDetailsPage'
import { BookingCreatePage } from '@/features/pg/bookings/pages/BookingCreatePage'
import { ReportsPage } from '@/features/pg/reports/pages/ReportsPage'
import { FloorRoomsPage } from '@/features/pg/rooms/pages/FloorRoomsPage'
import { FloorsPage } from '@/features/pg/rooms/pages/FloorsPage'
import { GuestsPage } from '@/features/pg/guests/components/GuestsPage'

export function AppRouter(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path='/pg/rooms' element={<FloorsPage />} />
            <Route path='/pg/rooms/floor/:floorId' element={<FloorRoomsPage />} />
            <Route path='/pg/rooms/:floorId/:roomId' element={<RoomDetailsPage />} />
            <Route path='/pg/payments' element={<PaymentsPage />} />
            <Route path='/pg/rooms/:roomId' element={<RoomDetailsPage />} />
            <Route path='/pg/payments/create' element={<PaymentCreatePage />} />
            <Route path='/pg/payments/:paymentId' element={<PaymentDetailsPage />} />
           <Route path='/pg/payments/:paymentId/receipt' element={<ReceiptPage />} />
            <Route path='/pg/bookings' element={<BookingsPage />} />
            <Route path='/pg/bookings/create' element={<BookingCreatePage />} />
            <Route path='/pg/bookings/:bookingId' element={<BookingDetailsPage />} />
            <Route path='/pg/reports' element={<ReportsPage />} />
            <Route path='/pg/guests' element={<GuestsPage/>}/>
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
