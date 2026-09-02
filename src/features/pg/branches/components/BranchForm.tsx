import { useEffect, useState } from "react";
import { Branch, CreateBranchInput } from "../types/branch.types";

interface BranchFormProps {
    branch?: Branch
    onSubmit: (data: CreateBranchInput) => Promise<void>
    onCancel: () => void
}

const initialForm: CreateBranchInput = {
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    managerId: '',
    managerName: '',
    status: 'active'
}

export function BranchForm({ branch, onSubmit, onCancel }: BranchFormProps) {
    const [formData, setFromData] = useState<CreateBranchInput>(initialForm)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (branch) {
            setFromData({
                name: branch.name,
                code: branch.code,
                address: branch.address,
                city: branch.city,
                state: branch.state,
                pincode: branch.pincode,
                phone: branch.phone ?? '',
                email: branch.email ?? '',
                managerId: branch.managerId ?? '',
                managerName: branch.managerName ?? '',
                status: branch.status
            })
        } else {
            setFromData(initialForm)
        }
    }, [branch])

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target

        setFromData(previous => ({
            ...previous,
            [name]: value
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        try {
            setLoading(true)
            await onSubmit(formData)

        } finally {
            setLoading(false)
        }
    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >


            <div className="grid gap-4 md:grid-cols-2">


                <div>

                    <label className="text-sm font-medium">
                        Branch Name
                    </label>

                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="ABC Men's PG"
                        required
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />

                </div>



                <div>

                    <label className="text-sm font-medium">
                        Branch Code
                    </label>

                    <input
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        placeholder="ABC001"
                        required
                        className="mt-1 w-full rounded-md border px-3 py-2"
                    />

                </div>


            </div>





            <div>

                <label className="text-sm font-medium">
                    Address
                </label>

                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Branch address"
                    required
                    className="mt-1 w-full rounded-md border px-3 py-2"
                />

            </div>





            <div className="grid gap-4 md:grid-cols-3">


                <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                    className="rounded-md border px-3 py-2"
                />



                <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                    className="rounded-md border px-3 py-2"
                />



                <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    required
                    className="rounded-md border px-3 py-2"
                />


            </div>






            <div className="grid gap-4 md:grid-cols-2">


                <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="rounded-md border px-3 py-2"
                />



                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    type="email"
                    className="rounded-md border px-3 py-2"
                />


            </div>






            <div className="grid gap-4 md:grid-cols-2">


                <input
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleChange}
                    placeholder="Manager name"
                    className="rounded-md border px-3 py-2"
                />



                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="rounded-md border px-3 py-2"
                >

                    <option value="active">
                        Active
                    </option>


                    <option value="inactive">
                        Inactive
                    </option>

                    <option value="maintenance">
                        Maintenance
                    </option>

                    


                </select>


            </div>






            <div className="flex justify-end gap-3">


                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md border px-4 py-2"
                >
                    Cancel
                </button>



                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
                >

                    {loading
                        ? "Saving..."
                        : branch
                            ? "Update Branch"
                            : "Create Branch"
                    }

                </button>


            </div>


        </form>

    )

}