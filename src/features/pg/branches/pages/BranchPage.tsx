import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
    AlertCircle,
    Building2,
    LayoutGrid,
    Plus,
    Search,
    Table as TableIcon,
    X,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useBranches } from "../hooks/useBranches";
import { Branch, BranchStatus, CreateBranchInput } from "../types/branch.types";
import { BranchTable, BranchTableSkeleton } from "../components/BranchTable";
import { BranchCard, BranchCardSkeleton } from "../components/BranchCard";
import { BranchStats, BranchStatsSkeleton } from "../components/BranchStats";
import { BranchForm } from "../components/BranchForm";

export function BranchesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { branches, loading, error, addBranch, editBranch, removeBranch } = useBranches();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<BranchStatus | "all">("all");
    const [viewMode, setViewMode] = useState<"table" | "card">("table");
    const [showForm, setShowForm] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | undefined>();

    const isSuperAdmin = user?.role === "super_admin";

    // Filter branches
    const filteredBranches = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return branches.filter((branch) => {
            const name = (branch.name || "").toLowerCase();
            const code = (branch.code || "").toLowerCase();
            const city = (branch.city || "").toLowerCase();
            const state = (branch.state || "").toLowerCase();
            const address = (branch.address || "").toLowerCase();
            const manager = (branch.managerName || "").toLowerCase();
            const phone = (branch.phone || "").toLowerCase();
            const email = (branch.email || "").toLowerCase();

            const matchesSearch =
                !searchValue ||
                name.includes(searchValue) ||
                code.includes(searchValue) ||
                city.includes(searchValue) ||
                state.includes(searchValue) ||
                address.includes(searchValue) ||
                manager.includes(searchValue) ||
                phone.includes(searchValue) ||
                email.includes(searchValue);

            const matchesStatus =
                statusFilter === "all" || branch.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [branches, search, statusFilter]);

    async function handleSubmit(data: CreateBranchInput) {
        try {
            if (!isSuperAdmin || !user.organizationId) {
                return;
            }

            if (editingBranch) {
                await editBranch(editingBranch.id, data);
            } else {
                await addBranch({
                    ...data,
                    organizationId: user.organizationId,
                });
            }

            setShowForm(false);
            setEditingBranch(undefined);
        } catch (err) {
            console.error(err);
            alert(editingBranch ? "Failed to update branch" : "Failed to create branch");
        }
    }

    function handleCreate() {
        if (!isSuperAdmin) return;
        navigate("/pg/branches/create");
    }

    function handleEdit(branch: Branch) {
        if (!isSuperAdmin) return;
        navigate(`/pg/branches/${branch.id}/edit`);
    }

    function handleView(branch: Branch) {
        navigate(`/pg/branches/${branch.id}`);
    }

    async function handleDelete(branch: Branch) {
        if (!isSuperAdmin) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete branch "${branch.name}"?`
        );
        if (!confirmed) return;

        try {
            await removeBranch(branch.id);
        } catch (err) {
            console.error(err);
            alert("Failed to delete branch");
        }
    }

    function handleCancelForm() {
        setShowForm(false);
        setEditingBranch(undefined);
    }

    return (
        <div className="w-full min-w-0 space-y-4 p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">
                        Branches
                    </h1>
                    <p className="mt-0.5 text-xs text-neutral-400">
                        {isSuperAdmin
                            ? "Manage your PG branches, facilities, and contact information"
                            : "Your assigned PG branch and facilities overview"}
                    </p>
                </div>

                {isSuperAdmin && (
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-neutral-800 cursor-pointer shrink-0"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        New Branch
                    </button>
                )}
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

            {/* Loading State */}
            {loading ? (
                <div className="space-y-4">
                    <BranchStatsSkeleton />

                    {/* Filter Skeleton */}
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between animate-pulse">
                        <div className="h-9 w-full sm:max-w-md rounded-xl bg-neutral-100" />
                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                            <div className="h-9 flex-1 sm:w-28 rounded-xl bg-neutral-100" />
                            <div className="h-9 w-32 rounded-xl bg-neutral-100 shrink-0" />
                        </div>
                    </div>

                    {viewMode === "table" ? (
                        <BranchTableSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <BranchCardSkeleton key={i} />
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Summary Statistics with Interactive Filtering */}
                    <BranchStats
                        branches={branches}
                        selectedStatus={statusFilter}
                        onSelectStatus={setStatusFilter}
                    />

                    {/* Inline Form (if open for quick editing) */}
                    {showForm && (
                        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-7 shadow-2xs">
                            <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
                                <div>
                                    <h2 className="text-base font-bold text-neutral-900">
                                        {editingBranch ? "Edit Branch" : "Create Branch"}
                                    </h2>
                                    <p className="text-xs text-neutral-400">
                                        {editingBranch
                                            ? `Update ${editingBranch.name} information`
                                            : "Add a new PG branch location"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCancelForm}
                                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <BranchForm
                                branch={editingBranch}
                                onSubmit={handleSubmit}
                                onCancel={handleCancelForm}
                            />
                        </div>
                    )}

                    {/* Search, Filter & View Controls */}
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, code, city, manager..."
                                className="w-full rounded-xl border border-neutral-200 bg-white pl-9 pr-8 py-2 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        {/* Status Filter & View Switcher */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value as BranchStatus | "all")
                                }
                                className="flex-1 sm:flex-initial rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 shadow-2xs outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="maintenance">Maintenance</option>
                            </select>

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
                    </div>

                    {/* Branch List (Table or Card View) */}
                    {filteredBranches.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 sm:p-12 text-center shadow-2xs">
                            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400">
                                <Building2 className="h-5 w-5" />
                            </div>
                            <h3 className="mt-3 text-sm font-bold text-neutral-900">
                                No branches found
                            </h3>
                            <p className="mt-1 text-xs text-neutral-400 max-w-sm mx-auto">
                                {search || statusFilter !== "all"
                                    ? "No branches match your current search and filter criteria."
                                    : "No branches are registered in your organization yet."}
                            </p>
                            {search || statusFilter !== "all" ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        setStatusFilter("all");
                                    }}
                                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-all cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            ) : (
                                isSuperAdmin && (
                                    <button
                                        type="button"
                                        onClick={handleCreate}
                                        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Branch
                                    </button>
                                )
                            )}
                        </div>
                    ) : viewMode === "table" ? (
                        <BranchTable
                            branches={filteredBranches}
                            onView={handleView}
                            onEdit={isSuperAdmin ? handleEdit : undefined}
                            onDelete={isSuperAdmin ? handleDelete : undefined}
                            onAdd={isSuperAdmin ? handleCreate : undefined}
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredBranches.map((branch) => (
                                <BranchCard
                                    key={branch.id}
                                    branch={branch}
                                    onView={handleView}
                                    onEdit={handleEdit}
                                    onDelete={isSuperAdmin ? handleDelete : undefined}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}