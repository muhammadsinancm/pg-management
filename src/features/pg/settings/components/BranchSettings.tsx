import { FormEvent, useEffect, useState } from "react";
import { BranchSettings as BranchSettingsType, UpdateBranchSettingsInput } from "../types/settings.type";

interface BranchSettingsProps {
    settings: BranchSettingsType | null
    loading?: boolean
    onSave: (data: UpdateBranchSettingsInput) => Promise<void>
}

export default function BranchSettings({ settings, loading = false, onSave }: BranchSettingsProps) {
    const [branchName, setBranchName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')
    const [managerName, setManagerName] = useState('')

    useEffect(() => {
        if (!settings) {
            return
        }

        setBranchName(settings.branchName)
        setAddress(settings.address ?? '')
        setPhone(settings.phone ?? '')
        setEmail(settings.email ?? '')
        setManagerName(settings.managerName ?? '')
    }, [settings])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        await onSave({
            branchName: branchName.trim(),
            address: address.trim() || undefined,
            phone: phone.trim() || undefined,
            email: phone.trim() || undefined,
            managerName: managerName.trim() || undefined
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-white shadow-sm"
        >
            <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Branch Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage branch information and manager
                    details.
                </p>
            </div>

            <div className="space-y-6 p-6">
                {/* Branch Information */}
                <div>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Branch Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="branchName"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Branch Name
                            </label>

                            <input
                                id="branchName"
                                type="text"
                                value={branchName}
                                onChange={(event) =>
                                    setBranchName(
                                        event.target.value
                                    )
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="Enter branch name"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="branchPhone"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Phone
                            </label>

                            <input
                                id="branchPhone"
                                type="tel"
                                value={phone}
                                onChange={(event) =>
                                    setPhone(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="Enter branch phone"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="branchEmail"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>

                            <input
                                id="branchEmail"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="branch@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="managerName"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Manager Name
                            </label>

                            <input
                                id="managerName"
                                type="text"
                                value={managerName}
                                onChange={(event) =>
                                    setManagerName(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="Enter manager name"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="branchAddress"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Address
                            </label>

                            <textarea
                                id="branchAddress"
                                value={address}
                                onChange={(event) =>
                                    setAddress(
                                        event.target.value
                                    )
                                }
                                rows={4}
                                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="Enter branch address"
                            />
                        </div>
                    </div>
                </div>

                {/* Branch ID */}
                {settings?.branchId && (
                    <div className="border-t border-gray-200 pt-6">
                        <p className="text-sm font-medium text-gray-700">
                            Branch ID
                        </p>

                        <p className="mt-1 break-all text-sm text-gray-500">
                            {settings.branchId}
                        </p>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Saving..."
                        : "Save Changes"}
                </button>
            </div>
        </form>
    )
}