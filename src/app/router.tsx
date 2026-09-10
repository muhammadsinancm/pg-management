import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardShell } from '@/features/dashboard/components/DashboardShell'
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
import { GuestDetailsPage } from '@/features/pg/guests/pages/GuestDetailsPage'
import { BranchesPage } from '@/features/pg/branches/pages/BranchPage'
import { CreateBranchPage } from '@/features/pg/branches/pages/CreateBranchPage'
import { BranchDetailsPage } from '@/features/pg/branches/pages/BranchDetailsPage'
import { EditBranchPage } from '@/features/pg/branches/pages/EditBranchPage'
import { StaffPage } from '@/features/pg/staff/pages/StaffPage'
import { CreateStaffPage } from '@/features/pg/staff/pages/CreateStaffPage'
import { StaffDetailsPage } from '@/features/pg/staff/pages/StaffDetailsPage'
import { EditStaffPage } from '@/features/pg/staff/pages/EditStaffPage'
import { BillingPage } from '@/features/pg/billing/pages/BillingPage'
import CreateInvoicePage from '@/features/pg/billing/pages/CreateInvoicePage'
import InvoiceDetailsPage from '@/features/pg/billing/pages/InvoiceDetailsPage'
import CreatePaymentPage from '@/features/pg/billing/pages/CreatePaymentPage'
import CreateExpensePage from '@/features/pg/expenses/pages/CreateExpensePage'
import EditExpensePage from '@/features/pg/expenses/pages/EditExpensePage'
import ExpenseDetailsPage from '@/features/pg/expenses/pages/ExpenseDetailsPage'
import ExpensesPage from '@/features/pg/expenses/pages/ExpensesPage'
import MealsPage from '@/features/pg/meals/pages/MealsPage'
import CreateMealPage from '@/features/pg/meals/pages/CreateMealPage'
import EditMealPage from '@/features/pg/meals/pages/EditMealPage'
import MealDetailsPage from '@/features/pg/meals/pages/MealDetailsPage'
import SettingsPage from '@/features/pg/settings/pages/SettingsPage'
import DashboardPage from '@/features/pg/dashboard/pages/DashboardPage'
import EditInvoicePage from '@/features/pg/billing/pages/EditInvoicePage'
import CustomerMealsPage from '@/features/pg/meals/pages/CustomerMealsPage'
import CreateCustomerMealPage from '@/features/pg/meals/pages/CreateCustomerMealPage'
import { RoleGuard } from '@/router/RoleGuard'

export function AppRouter(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardShell />}>

            <Route element={<RoleGuard allowedRoles={['super_admin']} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path='/pg/reports' element={<ReportsPage />} />
            </Route>

            <Route path='/pg/rooms' element={<FloorsPage />} />
            <Route path='/pg/rooms/floor/:floorId' element={<FloorRoomsPage />} />
            <Route path='/pg/payments' element={<PaymentsPage />} />
            <Route path='/pg/rooms/:roomId' element={<RoomDetailsPage />} />
            <Route path='/pg/payments/create' element={<PaymentCreatePage />} />
            <Route path='/pg/payments/:paymentId' element={<PaymentDetailsPage />} />
            <Route path='/pg/payments/:paymentId/receipt' element={<ReceiptPage />} />
            <Route path='/pg/bookings' element={<BookingsPage />} />
            <Route path='/pg/bookings/create' element={<BookingCreatePage />} />
            <Route path='/pg/bookings/:bookingId' element={<BookingDetailsPage />} />
            <Route path='/pg/bookings/:bookingId/meals' element={<CustomerMealsPage />} />
            <Route path='/pg/bookings/:bookingId/meals/create' element={<CreateCustomerMealPage />} />
            <Route path='/pg/customers' element={<GuestsPage />} />
            <Route path='/pg/customers/:guestId' element={<GuestDetailsPage />} />
            <Route path='/pg/branches' element={<BranchesPage />} />
            <Route path='/pg/branches/create' element={<CreateBranchPage />} />
            <Route path='/pg/branches/:branchId' element={<BranchDetailsPage />} />
            <Route path='/pg/branches/:branchId/edit' element={<EditBranchPage />} />
            <Route path='/pg/staff/' element={<StaffPage />} />
            <Route path='/pg/staff/create' element={<CreateStaffPage />} />
            <Route path='/pg/staff/:staffId' element={<StaffDetailsPage />} />
            <Route path='/pg/staff/:staffId/edit' element={<EditStaffPage />} />
            <Route path='/pg/billing' element={<BillingPage />} />
            <Route path='/pg/billing/invoices/create' element={<CreateInvoicePage />} />
            <Route path='/pg/billing/invoices/:invoiceId' element={<InvoiceDetailsPage />} />
            <Route path='/pg/billing/payments/:paymentId' element={<PaymentDetailsPage />} />
            <Route path='/pg/billing/payments/create' element={<CreatePaymentPage />} />
            <Route path='/pg/billing/invoices/:invoiceId/edit' element={<EditInvoicePage />} />
            <Route path='/pg/expenses' element={<ExpensesPage />} />
            <Route path='/pg/expenses/create' element={<CreateExpensePage />} />
            <Route path='/pg/expenses/edit/:expenseId' element={<EditExpensePage />} />
            <Route path='/pg/expenses/:expenseId' element={<ExpenseDetailsPage />} />
            <Route path='/pg/meals' element={<MealsPage />} />
            <Route path='/pg/meals/create' element={<CreateMealPage />} />
            <Route path='/pg/meals/edit/:mealId' element={<EditMealPage />} />
            <Route path='/pg/meals/:mealId' element={<MealDetailsPage />} />
            <Route path='/pg/meals/customer' element={<CustomerMealsPage />} />
            <Route path='/pg/settings' element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/pg/rooms" replace />} />
        <Route path="*" element={<Navigate to="/pg/rooms" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
