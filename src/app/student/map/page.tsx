import FairMap from "@/components/map/FairMap";
import { Exhibitor } from "@/components/shared/hooks/api/useExhibitors";

const mockExhibitors: Exhibitor[] = [
  {
    id: 1,
    name: "Armada",
    type: "Fair",
    fairLocation: "booth1",
    logoSquared: "/vercel.svg",
    about: "Scandinavia's biggest career fair",
    climateCompensation: true,
    groups: [],
    industries: [],
    employments: [],
    locations: [],
  },
];

export default function StudentMap() {
  return (
    <FairMap exhibitors={mockExhibitors} />
  )
}