import { LocationId, locations } from "@/app/student/map/lib/locations"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export default function SelectLocation({
  locationId,
  setLocationId,
  setActiveBoothId
}: {
  locationId: LocationId
  setLocationId: (id: LocationId) => void
  setActiveBoothId: (id: number | null) => void
}) {
  return (
    <div className="absolute right-2 top-2 justify-self-center rounded-full">
      <Select
        value={locationId}
        onValueChange={(id: LocationId) => {
          setLocationId(id)
          setActiveBoothId(null)
        }}>
        <SelectTrigger className="w-[180px] rounded-full py-5 dark:ring-offset-0 dark:focus:ring-0">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          {locations.map(loc => (
            <SelectItem key={loc.id} value={loc.id}>
              {loc.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
