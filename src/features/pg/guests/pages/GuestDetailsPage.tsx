import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AlertCircle, ArrowLeft, X } from "lucide-react";
import { CreateGuestInput, Guest } from "../types/guests.types";
import { deleteGuest, getGuest, updateGuest } from "../services/guestService";
import { GuestDetails } from "../components/GuestDetails";
import { GuestForm } from "../components/GuestForm";

export function GuestDetailsPage() {
    const { guestId } = useParams<{ guestId: string }>();
    const navigate = useNavigate();

    const [guest, setGuest] = useState<Guest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        async function loadGuest() {
            if (!guestId) {
                setError("Guest ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await getGuest(guestId);
                setGuest(data);
            } catch (err) {
                console.error("Failed to load guest", err);
                setError("Failed to load guest details.");
            } finally {
                setLoading(false);
            }
        }

        loadGuest();
    }, [guestId]);

    const handleEditSubmit = async (data: CreateGuestInput) => {
        if (!guest) return;
        try {
            await updateGuest(guest.id, data);
            setGuest({
                ...guest,
                ...data,
                updatedAt: new Date().toISOString(),
            });
            setShowEditModal(false);
        } catch (err) {
            console.error(err);
            alert("Failed to update guest details.");
        }
    };

    const handleDelete = async () => {
        if (!guest) return;
        const confirmed = window.confirm(`Are you sure you want to delete ${guest.fullName}?`);
        if (!confirmed) return;

        try {
            await deleteGuest(guest.id);
            navigate("/pg/customers");
        } catch (err) {
            console.error(err);
            alert("Failed to delete guest.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[360px] items-center justify-center p-8 text-neutral-400">
                <div className="text-center space-y-2">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
                    <p className="text-xs font-medium">Loading guest profile...</p>
                </div>
            </div>
        );
    }

    if (error || !guest) {
        return (
            <div className="space-y-4 p-4 sm:p-6">
                <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 sm:p-5 text-red-700 shadow-2xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                        <p className="text-xs sm:text-sm font-semibold">
                            {error || "Guest record not found."}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/pg/customers")}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-neutral-800 transition-all cursor-pointer"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Guests
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-w-0 space-y-5 p-4 sm:p-6">
            <GuestDetails
                guest={guest}
                onBack={() => navigate("/pg/customers")}
                onEdit={() => setShowEditModal(true)}
                onDelete={handleDelete}
            />

            {/* Edit Guest Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl border border-neutral-100">
                        <div className="mb-5 flex items-center justify-between border-b border-neutral-100 pb-3">
                            <h2 className="text-base sm:text-lg font-bold text-neutral-900">
                                Edit Guest Profile
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowEditModal(false)}
                                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <GuestForm
                            guest={guest}
                            onSubmit={handleEditSubmit}
                            onCancel={() => setShowEditModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}