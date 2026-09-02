import { FormEvent, useEffect, useState } from "react"
import { CreateGuestInput, Gender, Guest, IdType } from "../types/guests.types"
import { Room } from "../../rooms/types/room.types"
import { getRooms } from "../../rooms/services/roomService"
import { Floor } from "../../rooms/types/floor.types"
import { getFloors } from "../../rooms/services/floorService"

interface GuestFormProps {
    branchId: string
    guest?: Guest
    onSubmit: (data: CreateGuestInput) => Promise<void>
    onCancel: () => void
}

export function GuestForm({ branchId, guest, onSubmit, onCancel }: GuestFormProps) {

    const [fullName, setFullName] = useState(guest?.fullName ?? '')
    const [phone, setPhone] = useState(guest?.phone ?? '')
    const [dateOfBirth, setDateOfBirth] = useState(guest?.dateOfBirth ?? '')
    const [email, setEmail] = useState(guest?.email ?? '')
    const [gender, setGender] = useState<Gender>(guest?.gender ?? 'male')
    const [idType, setIdType] = useState<IdType>(guest?.idType ?? 'aadhar')
    const [idNumber, setIdNumber] = useState(guest?.idNumber ?? '')
    const [address, setAddress] = useState(guest?.address ?? '')
    const [city, setCity] = useState(guest?.city ?? '')
    const [state, setState] = useState(guest?.state ?? '')
    const [pincode, setPincode] = useState(guest?.pincode ?? '')
    const [emergencyName, setEmergencyName] = useState(guest?.emergencyContact?.name ?? '')
    const [emergencyPhone, setEmergencyPhone] = useState(guest?.emergencyContact?.phone ?? '')
    const [emergencyRelation, setEmergencyRelation] = useState(guest?.emergencyContact?.relation ?? '')
    const [rooms, setRooms] = useState<Room[]>([])
    const [roomId, setRoomId] = useState(guest?.roomId ?? '')
    const [bedId, setBedId] = useState(guest?.bedId ?? '')
    const [floors, setFloors] = useState<Floor[]>([])
    const [floorId, setFloorId] = useState('')
    const [loadingRooms, setLoadingRooms] = useState(false)
    const [checkInDate, setCheckInDate] = useState(guest?.checkInDate ?? '')
    const [expectedCheckOutDate, setExpectedCheckOutDate] = useState(guest?.expectedCheckOutDate ?? '')
    const [notes, setNotes] = useState(guest?.notes ?? '')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadData() {
            try {
                setLoadingRooms(true)

                const [floorData, roomData] = await Promise.all([
                    getFloors(),
                    getRooms()
                ])

                setFloors(floorData.filter(floor => floor.branchId === branchId))

                setRooms(roomData.filter(room => room.branchId === branchId))

            } catch (error) {
                console.error('Failed to load rools/floors', error)

            } finally {
                setLoadingRooms(false)
            }
        }
        loadData()
    }, [branchId])

    useEffect(() => {
        if (guest?.roomId && rooms.length > 0) {
            const guestRoom = rooms.find(room => room.id === guest.roomId)
            if (guestRoom) {
                setFloorId(guestRoom.floorId)
            }
        }
    }, [guest?.roomId, rooms])

    const selectedFloor = floors.find(floor => floor.id === floorId)

    const selectedRoom = rooms.find(room => room.id === roomId && room.floorId === floorId)

    const floorRooms = rooms.filter(room => room.floorId === floorId)

    const availableBeds = selectedRoom?.beds?.filter(bed => bed.status === 'available' || bed.id === guest?.bedId) ?? []

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!fullName.trim()) {
            alert('Guest name is required')
            return
        }
        if (!phone.trim()) {
            alert('Phone number is required')
            return
        }
        if (!branchId.trim()) {
            alert('Branch is required')
            return
        }

        const selectedBed = selectedRoom?.beds?.find(bed => bed.id === bedId)

        const data: CreateGuestInput = {
            branchId,
            fullName: fullName.trim(),
            phone: phone.trim(),
            ...(email.trim() && {
                email: email.trim()
            }),
            ...(dateOfBirth.trim() && {
                dateOfBirth
            }),
            gender,
            idType,
            ...(idNumber.trim() && {
                idNumber: idNumber.trim()
            }),
            ...(address.trim() && {
                address: address.trim()
            }),
            ...(city.trim() && {
                city: city.trim()
            }),
            ...(state.trim() && {
                state: state.trim()
            }),
            ...(pincode.trim() && {
                pincode: pincode.trim()
            }),
            ...(emergencyName.trim() && {
                emergencyContact: {
                    name: emergencyName.trim(),
                    phone: emergencyPhone.trim(),
                    relation: emergencyRelation.trim()
                }
            }),
            ...(floorId && selectedFloor && {
                floorId: selectedFloor.id,
                floorNumber: selectedFloor.floorNumber,
                floorName: selectedFloor.name
            }),
            ...(roomId && selectedRoom && {
                roomId,
                roomNumber: selectedRoom.roomNumber
            }),
            ...(bedId && selectedBed && {
                bedId,
                bedNumber: selectedBed.bedNumber
            }),
            ...(checkInDate && {
                checkInDate
            }),
            ...(expectedCheckOutDate && {
                expectedCheckOutDate
            }),
            status: guest?.status ?? 'active',
            ...(notes.trim() && {
                notes: notes.trim()
            })

        }

        try {
            setLoading(true)
            await onSubmit(data)

        } catch (error) {
            console.error(error)
            alert('Failed to save guest')

        } finally {
            setLoading(false)
        }

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-5"
        >

            {/* ================================= */}
            {/* Personal Information */}
            {/* ================================= */}

            <div>

                <label className="mb-1 block text-sm font-medium">
                    Full Name
                </label>

                <input
                    value={fullName}
                    onChange={e =>
                        setFullName(e.target.value)
                    }
                    placeholder="Full Name"
                    className="w-full rounded-md border px-3 py-2"
                />

            </div>

            <div>

                <label className="mb-1 block text-sm font-medium">
                    Phone
                </label>

                <input
                    value={phone}
                    onChange={e =>
                        setPhone(e.target.value)
                    }
                    placeholder="9876543210"
                    className="w-full rounded-md border px-3 py-2"
                />

            </div>

            <div>

                <label className="mb-1 block text-sm font-medium">
                    Date of Birth
                </label>

                <input
                    type="date"
                    value={dateOfBirth}
                    onChange={e =>
                        setDateOfBirth(e.target.value)
                    }
                    className="w-full rounded-md border px-3 py-2"
                />

            </div>

            <div>

                <label className="mb-1 block text-sm font-medium">
                    Email
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={e =>
                        setEmail(e.target.value)
                    }
                    placeholder="guest@email.com"
                    className="w-full rounded-md border px-3 py-2"
                />

            </div>

            {/* ================================= */}
            {/* Gender + ID Type */}
            {/* ================================= */}

            <div className="grid grid-cols-2 gap-4">

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Gender
                    </label>

                    <select
                        value={gender}
                        onChange={e =>
                            setGender(
                                e.target.value as Gender
                            )
                        }
                        className="w-full rounded-md border px-3 py-2"
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

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        ID Type
                    </label>

                    <select
                        value={idType}
                        onChange={e =>
                            setIdType(
                                e.target.value as IdType
                            )
                        }
                        className="w-full rounded-md border px-3 py-2"
                    >

                        <option value="aadhar">
                            Aadhaar
                        </option>

                        <option value="passport">
                            Passport
                        </option>

                        <option value="driving_license">
                            Driving License
                        </option>

                        <option value="voter_id">
                            Voter ID
                        </option>

                        <option value="other">
                            Other
                        </option>

                    </select>

                </div>

            </div>

            {/* ================================= */}
            {/* ID Number */}
            {/* ================================= */}

            <div>

                <label className="mb-1 block text-sm font-medium">
                    ID Number
                </label>

                <input
                    value={idNumber}
                    onChange={e =>
                        setIdNumber(e.target.value)
                    }
                    placeholder="ID number"
                    className="w-full rounded-md border px-3 py-2"
                />

            </div>

            {/* ================================= */}
            {/* Address */}
            {/* ================================= */}

            <div>

                <label className="mb-1 block text-sm font-medium">
                    Address
                </label>

                <textarea
                    value={address}
                    onChange={e =>
                        setAddress(e.target.value)
                    }
                    rows={3}
                    placeholder="Full address"
                    className="w-full rounded-md border px-3 py-2"
                />

            </div>

            {/* ================================= */}
            {/* City / State / Pincode */}
            {/* ================================= */}

            <div className="grid grid-cols-3 gap-4">

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        City
                    </label>

                    <input
                        value={city}
                        onChange={e =>
                            setCity(e.target.value)
                        }
                        placeholder="City"
                        className="w-full rounded-md border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        State
                    </label>

                    <input
                        value={state}
                        onChange={e =>
                            setState(e.target.value)
                        }
                        placeholder="State"
                        className="w-full rounded-md border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Pincode
                    </label>

                    <input
                        value={pincode}
                        onChange={e =>
                            setPincode(e.target.value)
                        }
                        placeholder="Pincode"
                        inputMode="numeric"
                        className="w-full rounded-md border px-3 py-2"
                    />

                </div>

            </div>

            {/* ================================= */}
            {/* FLOOR → ROOM → BED */}
            {/* ================================= */}

            <div className="grid grid-cols-3 gap-4">

                {/* FLOOR */}

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Floor
                    </label>

                    <select
                        value={floorId}
                        onChange={e => {

                            const newFloorId =
                                e.target.value

                            setFloorId(newFloorId)

                            // Reset room
                            setRoomId('')

                            // Reset bed
                            setBedId('')
                        }}
                        disabled={loadingRooms}
                        className="w-full rounded-md border px-3 py-2"
                    >

                        <option value="">

                            {loadingRooms
                                ? 'Loading floors...'
                                : 'Select Floor'}

                        </option>

                        {floors.map(floor => (

                            <option
                                key={floor.id}
                                value={floor.id}
                            >

                                {floor.name}

                            </option>

                        ))}

                    </select>

                </div>

                {/* ROOM */}

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Room
                    </label>

                    <select
                        value={roomId}
                        onChange={e => {

                            const newRoomId =
                                e.target.value

                            setRoomId(newRoomId)

                            // Reset bed
                            setBedId('')
                        }}
                        disabled={!floorId}
                        className="w-full rounded-md border px-3 py-2 disabled:bg-gray-100"
                    >

                        <option value="">

                            {!floorId
                                ? 'Select Floor First'
                                : floorRooms.length === 0
                                    ? 'No Rooms'
                                    : 'Select Room'}

                        </option>

                        {floorRooms.map(room => (

                            <option
                                key={room.id}
                                value={room.id}
                            >

                                Room {room.roomNumber}

                            </option>

                        ))}

                    </select>

                </div>

                {/* BED */}

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Bed
                    </label>

                    <select
                        value={bedId}
                        onChange={e =>
                            setBedId(e.target.value)
                        }
                        disabled={!roomId}
                        className="w-full rounded-md border px-3 py-2 disabled:bg-gray-100"
                    >

                        <option value="">

                            {!roomId
                                ? 'Select Room First'
                                : availableBeds.length === 0
                                    ? 'No Beds Available'
                                    : 'Select Bed'}

                        </option>

                        {availableBeds.map(bed => (

                            <option
                                key={bed.id}
                                value={bed.id}
                            >

                                Bed {bed.bedNumber}

                            </option>

                        ))}

                    </select>

                </div>

            </div>

            {/* ================================= */}
            {/* Emergency Contact */}
            {/* ================================= */}

            <div>

                <label className="mb-1 block text-sm font-medium">
                    Emergency Contact Name
                </label>

                <input
                    value={emergencyName}
                    onChange={e =>
                        setEmergencyName(
                            e.target.value
                        )
                    }
                    placeholder="Emergency contact name"
                    className="w-full rounded-md border px-3 py-2"
                />

            </div>

            <div className="grid grid-cols-2 gap-4">

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Emergency Phone
                    </label>

                    <input
                        value={emergencyPhone}
                        onChange={e =>
                            setEmergencyPhone(
                                e.target.value
                            )
                        }
                        placeholder="Emergency phone"
                        className="w-full rounded-md border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Relationship
                    </label>

                    <input
                        value={emergencyRelation}
                        onChange={e =>
                            setEmergencyRelation(
                                e.target.value
                            )
                        }
                        placeholder="Father / Mother / Brother"
                        className="w-full rounded-md border px-3 py-2"
                    />

                </div>

            </div>

            {/* ================================= */}
            {/* Stay Dates */}
            {/* ================================= */}

            <div className="grid grid-cols-2 gap-4">

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Check In
                    </label>

                    <input
                        type="date"
                        value={checkInDate}
                        onChange={e =>
                            setCheckInDate(
                                e.target.value
                            )
                        }
                        className="w-full rounded-md border px-3 py-2"
                    />

                </div>

                <div>

                    <label className="mb-1 block text-sm font-medium">
                        Expected Check Out
                    </label>

                    <input
                        type="date"
                        value={expectedCheckOutDate}
                        onChange={e =>
                            setExpectedCheckOutDate(
                                e.target.value
                            )
                        }
                        className="w-full rounded-md border px-3 py-2"
                    />

                </div>

            </div>

            {/* ================================= */}
            {/* Notes */}
            {/* ================================= */}

            <div>

                <label className="mb-1 block text-sm font-medium">
                    Notes
                </label>

                <textarea
                    value={notes}
                    onChange={e =>
                        setNotes(e.target.value)
                    }
                    rows={3}
                    placeholder="Additional notes"
                    className="w-full rounded-md border px-3 py-2"
                />

            </div>

            {/* ================================= */}
            {/* Buttons */}
            {/* ================================= */}

            <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="rounded-md border px-4 py-2 disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50"
                >

                    {loading
                        ? 'Saving...'
                        : guest
                            ? 'Update Guest'
                            : 'Create Guest'}

                </button>

            </div>

        </form>
    )
}