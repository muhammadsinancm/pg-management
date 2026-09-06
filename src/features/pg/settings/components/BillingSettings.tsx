import { FormEvent, useEffect, useState } from "react";
import { BillingSettings as BillingSettingsType, UpdateBillingSettingsInput } from "../types/settings.type";

interface BillingSettingsProps {
    settings: BillingSettingsType | null
    loading?: boolean
    onSave: (data: UpdateBillingSettingsInput) => Promise<void>
}

export default function BillingSettings({ settings, loading = false, onSave }: BillingSettingsProps) {
    const [invoicePrefix, setInvoicePrefix] = useState('INV')
    const [invoiceStartingNumber, setInvoiceStartingNumber] = useState('1')
    const [paymentDueDays, setPaymentDueDays] = useState('7')
    const [lateFeeEnabled, setLateFeeEnabled] = useState(false)
    const [lateFeeAmount, setLateFeeAmount] = useState('')
    const [taxEnabled, setTaxEnabled] = useState(false)
    const [taxPercentage, setTaxPercentage] = useState('')

    useEffect(() => {
        if (!settings) {
            return
        }

        setInvoicePrefix(settings.invoicePrefix)
        setInvoiceStartingNumber(String(settings.invoiceStartingNumber))
        setPaymentDueDays(String(settings.paymentDueDays))
        setLateFeeEnabled(settings.lateFeeEnabled)
        setLateFeeAmount(settings.lateFeeAmount !== undefined ? String(settings.lateFeeAmount) : '')
        setTaxEnabled(settings.taxEnabled)
        setTaxPercentage(settings.taxPercentage !== undefined ? String(settings.taxPercentage) : '')
    }, [settings])

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const startingNumber = Number(invoiceStartingNumber)
        const dueDay = Number(paymentDueDays)
        const feeAmount = lateFeeAmount.trim() !== '' ? Number(lateFeeAmount) : undefined
        const taxRate = taxPercentage.trim() !== '' ? Number(taxPercentage) : undefined

        if (!invoicePrefix.trim() || startingNumber < 1 || dueDay < 0) {
            return
        }

        if (lateFeeEnabled && (feeAmount === undefined || feeAmount < 0)) {
            return
        }

        if (taxEnabled && (taxRate === undefined || taxRate < 0 || taxRate > 100)) {
            return
        }

        await onSave({
            invoicePrefix: invoicePrefix.trim(),
            invoiceStartingNumber: startingNumber,
            paymentDueDays: dueDay,
            lateFeeEnabled,
            lateFeeAmount: feeAmount,
            taxEnabled,
            taxPercentage: taxRate
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-gray-200 bg-white shadow-sm"
        >
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    Billing Settings
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Configure invoices, payment due dates,
                    late fees, and taxes.
                </p>
            </div>

            <div className="space-y-6 p-6">
                {/* Invoice Settings */}
                <div>
                    <h3 className="mb-4 text-sm font-semibold text-gray-900">
                        Invoice Settings
                    </h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label
                                htmlFor="invoicePrefix"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Invoice Prefix
                            </label>

                            <input
                                id="invoicePrefix"
                                type="text"
                                value={invoicePrefix}
                                onChange={(event) =>
                                    setInvoicePrefix(
                                        event.target.value
                                    )
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase outline-none focus:border-gray-500"
                                placeholder="INV"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="invoiceStartingNumber"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Starting Number
                            </label>

                            <input
                                id="invoiceStartingNumber"
                                type="number"
                                min="1"
                                value={
                                    invoiceStartingNumber
                                }
                                onChange={(event) =>
                                    setInvoiceStartingNumber(
                                        event.target.value
                                    )
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="paymentDueDays"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Payment Due Days
                            </label>

                            <input
                                id="paymentDueDays"
                                type="number"
                                min="0"
                                value={paymentDueDays}
                                onChange={(event) =>
                                    setPaymentDueDays(
                                        event.target.value
                                    )
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                            />
                        </div>
                    </div>

                    <p className="mt-3 text-xs text-gray-500">
                        Example invoice number:{" "}
                        <span className="font-medium text-gray-700">
                            {invoicePrefix || "INV"}-
                            {invoiceStartingNumber || "1"}
                        </span>
                    </p>
                </div>

                {/* Late Fee */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Late Fee
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Apply a fee when an invoice is
                                paid late.
                            </p>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={lateFeeEnabled}
                            onClick={() =>
                                setLateFeeEnabled(
                                    (value) => !value
                                )
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${lateFeeEnabled
                                    ? "bg-gray-900"
                                    : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition ${lateFeeEnabled
                                        ? "translate-x-5"
                                        : "translate-x-0.5"
                                    }`}
                            />
                        </button>
                    </div>

                    {lateFeeEnabled && (
                        <div className="mt-4 max-w-sm">
                            <label
                                htmlFor="lateFeeAmount"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Late Fee Amount
                            </label>

                            <input
                                id="lateFeeAmount"
                                type="number"
                                min="0"
                                step="0.01"
                                value={lateFeeAmount}
                                onChange={(event) =>
                                    setLateFeeAmount(
                                        event.target.value
                                    )
                                }
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                                placeholder="0.00"
                            />
                        </div>
                    )}
                </div>

                {/* Tax */}
                <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                                Tax
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                                Enable tax calculation on
                                invoices.
                            </p>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={taxEnabled}
                            onClick={() =>
                                setTaxEnabled(
                                    (value) => !value
                                )
                            }
                            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${taxEnabled
                                    ? "bg-gray-900"
                                    : "bg-gray-300"
                                }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition ${taxEnabled
                                        ? "translate-x-5"
                                        : "translate-x-0.5"
                                    }`}
                            />
                        </button>
                    </div>

                    {taxEnabled && (
                        <div className="mt-4 max-w-sm">
                            <label
                                htmlFor="taxPercentage"
                                className="mb-1 block text-sm font-medium text-gray-700"
                            >
                                Tax Percentage
                            </label>

                            <div className="relative">
                                <input
                                    id="taxPercentage"
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.01"
                                    value={taxPercentage}
                                    onChange={(event) =>
                                        setTaxPercentage(
                                            event.target.value
                                        )
                                    }
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-gray-500"
                                    placeholder="0.00"
                                />

                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                                    %
                                </span>
                            </div>
                        </div>
                    )}
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