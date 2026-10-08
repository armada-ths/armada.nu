// import InnovationFloor from "@/assets/KTH_Innovation.svg";
import InnovationFloor from "@/assets/clean-KTH_Innovation.svg"
import NymbleFloor1And2 from "@/assets/clean-Nymble_f2-01.svg"
import NymbleFloor3 from "@/assets/clean-Nymble_f3-01.svg"

export interface MapDefinition {
  name: string
  component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

export const MAPS: MapDefinition[] = [
  { name: "Nymble Floor 1 & 2", component: NymbleFloor1And2 },
  { name: "Nymble Floor 3", component: NymbleFloor3 },
  { name: "KTH Innovation", component: InnovationFloor }
]
