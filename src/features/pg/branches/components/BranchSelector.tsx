import { Building2 } from "lucide-react";
import { Branch } from "../types/branch.types";

interface BranchSelectorProps {
    branches: Branch[]
    onChange: (branchId: string) => void
    disabled?: boolean
    value: string

}

export function BranchSelector({branches, onChange, disabled = false, value}: BranchSelectorProps) {
return (
        <div className="rounded-xl border bg-card p-5">

            <div className="mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />

                <div>
                    <h2 className="font-semibold">
                        Select Branch
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Select a branch to manage its floors and rooms.
                    </p>
                </div>
            </div>

            <select
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                disabled={disabled}
                className="
                    w-full
                    rounded-md
                    border
                    bg-background
                    px-3
                    py-2.5
                    text-sm
                    outline-none
                    focus:ring-2
                    focus:ring-primary
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                <option value="">
                    Select a branch
                </option>

                {branches.map((branch) => (
                    <option
                        key={branch.id}
                        value={branch.id}
                    >
                        {branch.name} ({branch.code})
                    </option>
                ))}
            </select>

        </div>
    );
}