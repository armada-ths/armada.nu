
import { default as InnovationFloor, default as NymbleFloor1 } from "@/assets/Innovation_floor_map-01.svg";
// import NymbleFloor2 from "@/assets/Nymble_floor_2.svg";
// import KTHInnovation from "@/assets/KTH_innovation_floor.svg";

export interface MapDefinition {
    name: string;
    component: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export const MAPS: MapDefinition[] = [
    { name: "KTH Innovation", component: InnovationFloor },
    { name: "Nymble Floor 1", component: NymbleFloor1 },
    // { name: "Nymble Floor 2", component: NymbleFloor2 },
    // { name: "KTH Innovation", component: KTHInnovation },
];
