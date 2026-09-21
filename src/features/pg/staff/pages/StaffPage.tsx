import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
    AlertCircle,
    LayoutGrid,
    Plus,
    Table as TableIcon,
    X,
} from "lucide-react";
import { SalaryType, Staff, StaffRole, StaffStatus as StaffStatusType } from "../types/staff.types";
import { useStaff } from "../hooks/useStaff";
import { StaffForm } from "../components/StaffForm";
import { StaffTable, StaffTableSkeleton } from "../components/StaffTable";
import { StaffCard, StaffCardSkeleton } from "../components/StaffCard";
import { StaffStatus } from "../components/StaffStatus";
import { StaffFilters } from "../components/StaffFilters";

export function StaffPage() {
    const navigate = useNavigate();
    const { staff, loading, error, addStaff, editStaff, removeStaff } = useStaff();

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all");
    const [statusFilter, setStatusFilter] = useState<StaffStatusType | "all">("all");
    const [salaryTypeFilter, setSalaryTypeFilter] = useState<SalaryType | "all">("all");
    const [viewMode, setViewMode] = useState<"table" | "card">("table");

    const [showForm, setShowForm] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | undefined>();

    // Filter staff based on search, role, status, and salary type
    const filteredStaff = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return staff.filter((member) => {
            const name = (member.name || "").toLowerCase();
            const phone = (member.phone || "").toLowerCase();
            const email = (member.email || "").toLowerCase();
            const empId = (member.employeeId || "").toLowerCase();

            const matchesSearch =
                !searchValue ||
                name.includes(searchValue) ||
                phone.includes(searchValue) ||
                email.includes(searchValue) ||
                empId.includes(searchValue);

            const matchesRole = roleFilter === "all" || member.role === roleFilter;
            const matchesStatus = statusFilter === "all" || member.status === statusFilter;
            const matchesSalaryType =
                salaryTypeFilter === "all" || member.salaryType === salaryTypeFilter;

            return matchesSearch && matchesRole && matchesStatus && matchesSalaryType;
        });
    }, [staff, search, roleFilter, statusFilter, salaryTypeFilter]);

    const handleStatusSelect = (selected: StaffStatusType | "all") => {
        setStatusFilter((prev) => (prev === selected ? "all" : selected));
    };

    const handleClearFilters = () => {
        setSearch("");
        setRoleFilter("all");
        setStatusFilter("all");
        setSalaryTypeFilter("all");
    };

    async function handleSubmit(data: Parameters<typeof addStaff>[0]) {
        try {
            if (editingStaff) {
                await editStaff(editingStaff.id, data);
            } else {
                await addStaff(data);
            }
            setEditingStaff(undefined);
            setShowForm(false);
        } catch (err) {
            console.error("Failed to save staff member", err);
            alert(editingStaff ? "Failed to update staff member." : "Failed to add staff member.");
        }
    }

    function handleEdit(member: Staff) {
        setEditingStaff(member);
        setShowForm(true);
    }

    function handleView(member: Staff) {
        navigate(`/pg/staff/${member.id}`);
    }

    async function handleDelete(member: Staff) {
        const confirmed = window.confirm(`Are you sure you want to delete ${member.name}?`);
        if (!confirmed) return;

        try {
            await removeStaff(member.id);
        } catch (err) {
            console.error("Failed to delete staff member", err);
            alert("Failed to delete staff member.");
        }
    }

    return (
        <div className="w-full min-w-0 space-y-4">
            {/* Header */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Staff Management
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        Manage PG staff members, assign roles, and handle payroll records
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setEditingStaff(undefined);
                            setShowForm(true);
                        }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer shrink-0"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Staff</span>
                    </button>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-3.5 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                        <p className="text-xs font-semibold text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {/* KPI Metric Summary Cards */}
            <StaffStatus
                staff={staff}
                selectedStatus={statusFilter}
                onSelectStatus={handleStatusSelect}
            />

            {/* Search & Filters */}
            <StaffFilters
                search={search}
                role={roleFilter}
                status={statusFilter}
                salaryType={salaryTypeFilter}
                onSearchChange={setSearch}
                onRoleChange={setRoleFilter}
                onStatusChange={setStatusFilter}
                onSalaryTypeChange={setSalaryTypeFilter}
                onClear={handleClearFilters}
            />

            {/* View Mode Bar */}
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-neutral-500">
                    Showing <span className="font-bold text-neutral-900">{filteredStaff.length}</span> of{" "}
                    <span className="font-bold text-neutral-900">{staff.length}</span> staff members
                </p>

                <div className="inline-flex items-center rounded-xl border border-neutral-200 bg-white p-0.5 shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setViewMode("table")}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                            viewMode === "table"
                                ? "bg-neutral-900 text-white shadow-2xs"
                                : "text-neutral-500 hover:text-neutral-900"
                        }`}
                        title="Table View"
                    >
                        <TableIcon className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Table</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode("card")}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                            viewMode === "card"
                                ? "bg-neutral-900 text-white shadow-2xs"
                                : "text-neutral-500 hover:text-neutral-900"
                        }`}
                        title="Card View"
                    >
                        <LayoutGrid className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Cards</span>
                    </button>
                </div>
            </div>

            {/* Staff Content */}
            {loading ? (
                viewMode === "table" ? (
                    <StaffTableSkeleton />
                ) : (
                    <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <StaffCardSkeleton key={i} />
                        ))}
                    </div>
                )
            ) : viewMode === "table" ? (
                <StaffTable
                    staff={filteredStaff}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAdd={() => {
                        setEditingStaff(undefined);
                        setShowForm(true);
                    }}
                />
            ) : filteredStaff.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 xl:p-12 text-center shadow-2xs">
                    <h3 className="text-sm font-bold text-neutral-900">No staff found</h3>
                    <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                        No staff members match your current filters.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setEditingStaff(undefined);
                            setShowForm(true);
                        }}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                    >
                        + Add Staff
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredStaff.map((member) => (
                        <StaffCard
                            key={member.id}
                            staff={member}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modal Dialog for Add / Edit */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 backdrop-blur-xs">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xl">
                        <div className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-3">
                            <div>
                                <h2 className="text-lg font-bold text-neutral-900">
                                    {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                                </h2>
                                <p className="text-xs text-neutral-500">
                                    {editingStaff
                                        ? "Update employee details and compensation"
                                        : "Fill in the details to register a new staff member"}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingStaff(undefined);
                                }}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <StaffForm
                            staff={editingStaff}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingStaff(undefined);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}