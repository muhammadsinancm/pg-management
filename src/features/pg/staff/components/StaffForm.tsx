import { FormEvent, useEffect, useState } from "react";
import { CreateStaffInput, Gender, SalaryType, Staff, StaffRole, StaffStatus } from "../types/staff.types";
import { Branch } from "../../branches/types/branch.types";
import { getBranches } from "../../branches/services/branchService";

interface StaffFormProps {
    staff?: Staff
    onSubmit: (data: CreateStaffInput) => Promise<void>
    onCancel: () => void
}

export function StaffForm({ staff, onSubmit, onCancel }: StaffFormProps) {
    const [branchId, setBranchId] = useState(staff?.branchId ?? '')
    const [employeeId, setEmployeeId] = useState(staff?.employeeId ?? '')
    const [name, setName] = useState(staff?.name ?? '')
    const [phone, setPhone] = useState(staff?.phone ?? '')
    const [email, setEmail] = useState(staff?.email ?? '')
    const [dateOfBirth, setDateOfBirth] = useState(staff?.dateOfBirth ?? '')
    const [gender, setGender] = useState<Gender>(staff?.gender ?? 'male')
    const [address, setAddress] = useState(staff?.address ?? '')
    const [role, setRole] = useState<StaffRole>(staff?.role ?? 'reception')
    const [joinedDate, setJoinedDate] = useState<string>(staff?.joinedDate ?? new Date().toISOString().split('T')[0])
    const [status, setStatus] = useState<StaffStatus>(staff?.status ?? 'active')
    const [salary, setSalary] = useState(staff?.salary?.toString() ?? '')
    const [salaryType, setSalaryType] = useState<SalaryType>(staff?.salaryType ?? 'monthly')
    const [paymentDay, setPaymentDay] = useState(staff?.paymentDay?.toString() ?? '')
    const [branches, setBranches] = useState<Branch[]>([])
    const [loadingBranches, setLoadingBranches] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadBranches() {
            try {
                setLoadingBranches(true)
                const data = await getBranches()
                setBranches(data)

            } catch (error) {
                console.error('Failed to load branches', error)

            } finally {
                setLoadingBranches(false)
            }
        }
        loadBranches()
    }, [])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!branchId) {
            alert('Brnach is required')
            return
        }
        if (!name.trim()) {
            alert('Staff name is required')
            return
        }
        if (!phone.trim()) {
            alert('Phone number is required')
        }
        if (!role) {
            alert('Staff role is required')
            return
        }
        if (!joinedDate) {
            alert('Joined data is required')
            return
        }
        if (!salary || Number(salary) < 0) {
            alert('Valid salary is required')
            return
        }

        const data: CreateStaffInput = {
            branchId,
            ...(employeeId.trim() && {
                employeeId: employeeId.trim()
            }),
            name: name.trim(),
            phone: phone.trim(),
            ...(email.trim() && {
                email: email.trim()
            }),
            ...(dateOfBirth && {
                dateOfBirth
            }),
            gender,
            ...(address.trim() && {
                address: address.trim()
            }),
            role,
            joinedDate,
            status,
            salary: Number(salary),
            salaryType,
            ...(paymentDay && {
                paymentDay: Number(paymentDay)
            })
        }

        try {
            setLoading(true)
            await onSubmit(data)

        } catch (error) {
            console.error('Failed to save staff', error)
            alert('Failed to save staff')

        } finally {
            setLoading(false)
        }

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-6"
        >

            {/* Branch */}

            <div>
                <label className="block mb-1">
                    Branch
                </label>

                <select
                    value={branchId}
                    onChange={(event) =>
                        setBranchId(
                            event.target.value
                        )
                    }
                    disabled={
                        loadingBranches ||
                        loading
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                >

                    <option value="">
                        Select Branch
                    </option>

                    {branches.map(branch => (

                        <option
                            key={branch.id}
                            value={branch.id}
                        >
                            {branch.name}
                        </option>

                    ))}

                </select>
            </div>


            {/* Employee ID */}

            <div>
                <label className="block mb-1">
                    Employee ID
                </label>

                <input
                    type="text"
                    value={employeeId}
                    onChange={(event) =>
                        setEmployeeId(
                            event.target.value
                        )
                    }
                    placeholder="ST001"
                    className="w-full border rounded px-3 py-2"
                />
            </div>


            {/* Name */}

            <div>
                <label className="block mb-1">
                    Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                        setName(
                            event.target.value
                        )
                    }
                    placeholder="Staff name"
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>


            {/* Phone */}

            <div>
                <label className="block mb-1">
                    Phone
                </label>

                <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                        setPhone(
                            event.target.value
                        )
                    }
                    placeholder="9876543210"
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>


            {/* Email */}

            <div>
                <label className="block mb-1">
                    Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(
                            event.target.value
                        )
                    }
                    placeholder="staff@example.com"
                    className="w-full border rounded px-3 py-2"
                />
            </div>


            {/* Date of Birth */}

            <div>
                <label className="block mb-1">
                    Date of Birth
                </label>

                <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(event) =>
                        setDateOfBirth(
                            event.target.value
                        )
                    }
                    className="w-full border rounded px-3 py-2"
                />
            </div>


            {/* Gender */}

            <div>
                <label className="block mb-1">
                    Gender
                </label>

                <select
                    value={gender}
                    onChange={(event) =>
                        setGender(
                            event.target.value as Gender
                        )
                    }
                    className="w-full border rounded px-3 py-2"
                >

                    <option value="male">
                        Male
                    </option>

                    <option value="female">
                        Female
                    </option>

                    <option value="other">
                        Other
                    </option>

                </select>
            </div>


            {/* Address */}

            <div>
                <label className="block mb-1">
                    Address
                </label>

                <textarea
                    value={address}
                    onChange={(event) =>
                        setAddress(
                            event.target.value
                        )
                    }
                    placeholder="Staff address"
                    rows={3}
                    className="w-full border rounded px-3 py-2"
                />
            </div>


            {/* Role */}

            <div>
                <label className="block mb-1">
                    Role
                </label>

                <select
                    value={role}
                    onChange={(event) =>
                        setRole(
                            event.target.value as StaffRole
                        )
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                >

                    <option value="manager">
                        Manager
                    </option>

                    <option value="reception">
                        Reception
                    </option>

                    <option value="cook">
                        Cook
                    </option>

                    <option value="cleaner">
                        Cleaner
                    </option>

                    <option value="security">
                        Security
                    </option>

                    <option value="maintenance">
                        Maintenance
                    </option>

                </select>
            </div>


            {/* Joined Date */}

            <div>
                <label className="block mb-1">
                    Joined Date
                </label>

                <input
                    type="date"
                    value={joinedDate}
                    onChange={(event) =>
                        setJoinedDate(
                            event.target.value
                        )
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>


            {/* Salary */}

            <div>
                <label className="block mb-1">
                    Salary
                </label>

                <input
                    type="number"
                    min="0"
                    value={salary}
                    onChange={(event) =>
                        setSalary(
                            event.target.value
                        )
                    }
                    placeholder="18000"
                    className="w-full border rounded px-3 py-2"
                    required
                />
            </div>


            {/* Salary Type */}

            <div>
                <label className="block mb-1">
                    Salary Type
                </label>

                <select
                    value={salaryType}
                    onChange={(event) =>
                        setSalaryType(
                            event.target.value as SalaryType
                        )
                    }
                    className="w-full border rounded px-3 py-2"
                >

                    <option value="monthly">
                        Monthly
                    </option>

                    <option value="weekly">
                        Weekly
                    </option>

                    <option value="daily">
                        Daily
                    </option>

                </select>
            </div>


            {/* Payment Day */}

            {salaryType === "monthly" && (

                <div>

                    <label className="block mb-1">
                        Salary Payment Day
                    </label>

                    <input
                        type="number"
                        min="1"
                        max="31"
                        value={paymentDay}
                        onChange={(event) =>
                            setPaymentDay(
                                event.target.value
                            )
                        }
                        placeholder="5"
                        className="w-full border rounded px-3 py-2"
                    />

                </div>

            )}


            {/* Status */}

            <div>
                <label className="block mb-1">
                    Employment Status
                </label>

                <select
                    value={status}
                    onChange={(event) =>
                        setStatus(
                            event.target.value as StaffStatus
                        )
                    }
                    className="w-full border rounded px-3 py-2"
                >

                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>

                </select>
            </div>


            {/* Actions */}

            <div className="flex gap-3">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="border rounded px-4 py-2"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded px-4 py-2 bg-black text-white"
                >
                    {loading
                        ? "Saving..."
                        : staff
                            ? "Update Staff"
                            : "Save Staff"
                    }
                </button>

            </div>

        </form>
    )
}