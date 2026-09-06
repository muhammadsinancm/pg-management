import { FormEvent, useEffect, useState } from "react";
import { Currency, DateFormat, GeneralSettings as GeneralSettingsType, ThemeMode, TimeFormat, UpdateGeneralSettingsInput } from "../types/settings.type";

interface GeneralSettingsProps {
    settings: GeneralSettingsType | null
    loading?: boolean
    onSave: (data: UpdateGeneralSettingsInput) => Promise<void>
}

export default function GeneralSettings({ settings, loading = false, onSave }: GeneralSettingsProps) {
    const [organizationName, setOrganizationName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [logoUrl, setLogoUrl] = useState('')
    const [currency, setCurrency] = useState<Currency>('INR')
    const [timezone, setTimezone] = useState('Asia/Kolkata')
    const [dateFormat, setDateFormat] = useState<DateFormat>('DD/MM/YYYY')
    const [timeFormat, setTimeFormat] = useState<TimeFormat>('12-hour')
    const [theme, setTheme] = useState<ThemeMode>('system')

    useEffect(() => {
        if (!settings) {
            return
        }

        setOrganizationName(settings.organizationName)
        setEmail(settings.email ?? '')
        setPhone(settings.phone ?? '')
        setAddress(settings.address ?? '')
        setLogoUrl(settings.logoUrl ?? '')
        setCurrency(settings.currency)
        setTimezone(settings.timezone)
        setDateFormat(settings.dateFormat)
        setTimeFormat(settings.timeFormat)
        setTheme(settings.theme)
    }, [settings])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        await onSave({
            organizationName: organizationName.trim(),
            email: email.trim() || undefined,
            address: address.trim() || undefined,
            logoUrl: logoUrl.trim() || undefined,
            currency,
            timezone,
            dateFormat,
            timeFormat,
            theme
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-white shadow-sm"
        >
            <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    General Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your organization information and
                    application preferences.
                </p>
            </div>

            <div className="space-y-6 p-6">
                {/* Organization Information */}
                <div>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Organization Information
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="organizationName"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Organization Name
                            </label>

                            <input
                                id="organizationName"
                                type="text"
                                value={organizationName}
                                onChange={(event) =>
                                    setOrganizationName(
                                        event.target.value
                                    )
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="Enter organization name"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="example@email.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Phone
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(event) =>
                                    setPhone(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="logoUrl"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Logo URL
                            </label>

                            <input
                                id="logoUrl"
                                type="url"
                                value={logoUrl}
                                onChange={(event) =>
                                    setLogoUrl(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label
                                htmlFor="address"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Address
                            </label>

                            <textarea
                                id="address"
                                value={address}
                                onChange={(event) =>
                                    setAddress(
                                        event.target.value
                                    )
                                }
                                rows={3}
                                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="Enter organization address"
                            />
                        </div>
                    </div>
                </div>

                {/* Regional Settings */}
                <div className="border-t border-gray-200 pt-6">
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Regional Settings
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div>
                            <label
                                htmlFor="currency"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Currency
                            </label>

                            <select
                                id="currency"
                                value={currency}
                                onChange={(event) =>
                                    setCurrency(
                                        event.target
                                            .value as Currency
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                            >
                                <option value="INR">
                                    INR - Indian Rupee
                                </option>
                                <option value="USD">
                                    USD - US Dollar
                                </option>
                                <option value="AED">
                                    AED - UAE Dirham
                                </option>
                                <option value="EUR">
                                    EUR - Euro
                                </option>
                                <option value="GBP">
                                    GBP - British Pound
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="timezone"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Timezone
                            </label>

                            <select
                                id="timezone"
                                value={timezone}
                                onChange={(event) =>
                                    setTimezone(
                                        event.target.value
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                            >
                                <option value="Asia/Kolkata">
                                    Asia/Kolkata
                                </option>
                                <option value="Asia/Dubai">
                                    Asia/Dubai
                                </option>
                                <option value="Asia/Singapore">
                                    Asia/Singapore
                                </option>
                                <option value="Europe/London">
                                    Europe/London
                                </option>
                                <option value="America/New_York">
                                    America/New_York
                                </option>
                                <option value="America/Los_Angeles">
                                    America/Los_Angeles
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="dateFormat"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Date Format
                            </label>

                            <select
                                id="dateFormat"
                                value={dateFormat}
                                onChange={(event) =>
                                    setDateFormat(
                                        event.target
                                            .value as DateFormat
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                            >
                                <option value="DD/MM/YYYY">
                                    DD/MM/YYYY
                                </option>
                                <option value="MM/DD/YYYY">
                                    MM/DD/YYYY
                                </option>
                                <option value="YYYY-MM-DD">
                                    YYYY-MM-DD
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="timeFormat"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Time Format
                            </label>

                            <select
                                id="timeFormat"
                                value={timeFormat}
                                onChange={(event) =>
                                    setTimeFormat(
                                        event.target
                                            .value as TimeFormat
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                            >
                                <option value="12-hour">
                                    12-hour
                                </option>
                                <option value="24-hour">
                                    24-hour
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="theme"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Theme
                            </label>

                            <select
                                id="theme"
                                value={theme}
                                onChange={(event) =>
                                    setTheme(
                                        event.target
                                            .value as ThemeMode
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                            >
                                <option value="system">
                                    System
                                </option>
                                <option value="light">
                                    Light
                                </option>
                                <option value="dark">
                                    Dark
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
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