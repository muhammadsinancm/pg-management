import { RecentCustomer } from "../types/dahsboard.types";

interface RecentCustomersProps {
    customers: RecentCustomer[]
}

export default function RecentCustomers({ customers }: RecentCustomersProps) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Recent Customers
                </h2>

                <p className="text-sm text-gray-500">
                    Recently added customers
                </p>
            </div>

            {customers.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">
                    No customers found.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-gray-200 text-left">
                                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Customer
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Room
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Status
                                </th>

                                <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Joined
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {customers.map((customer) => (
                                <tr
                                    key={customer.id}
                                    className="border-b border-gray-100 last:border-0"
                                >
                                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                        {customer.name}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-700">
                                        {customer.roomNumber}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">
                                            {customer.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-500">
                                        {customer.joinedDate}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}