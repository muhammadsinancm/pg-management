import { Room } from "../types/room.types";
import { RoomStatusBadge } from "./RoomStatusBadge";

interface RoomTableProps {
    rooms: Room[]
    onView: (room: Room) => void
    onEdit: (room: Room) => void
    onDelete: (room: Room) => void
}

export function RoomTable({rooms, onView, onEdit, onDelete}: RoomTableProps) {
    return (
        <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/30">
          <tr>
            <th className="px-4 py-3 font-medium">
              Room
            </th>

            <th className="px-4 py-3 font-medium">
              Floor
            </th>

            <th className="px-4 py-3 font-medium">
              Type
            </th>

            <th className="px-4 py-3 font-medium">
              Sharing
            </th>

            <th className="px-4 py-3 font-medium">
              Beds
            </th>

            <th className="px-4 py-3 font-medium">
              Rent
            </th>

            <th className="px-4 py-3 font-medium">
              Status
            </th>

            <th className="px-4 py-3 font-medium">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => {
            const occupied =
              (room.beds ?? []).filter(
                (bed) =>
                  bed.status ===
                  'occupied'
              ).length

            return (
              <tr
                key={room.id}
                className="border-b last:border-0"
              >
                <td className="px-4 py-3 font-medium">
                  {room.roomNumber}
                </td>

                <td className="px-4 py-3">
                  {room.floor || '-'}
                </td>

                <td className="px-4 py-3">
                  {room.type}
                </td>

                <td className="px-4 py-3">
                  {room.sharingType}
                </td>

                <td className="px-4 py-3">
                  {occupied}/{room.capacity}
                </td>

                <td className="px-4 py-3">
                  ₹{room.rent}
                </td>

                <td className="px-4 py-3">
                  <RoomStatusBadge
                    status={room.status}
                  />
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onView(room)
                      }
                      className="rounded border px-2 py-1 text-xs"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onEdit(room)
                      }
                      className="rounded border px-2 py-1 text-xs"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(room)
                      }
                      className="rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>

    )
}