import { LatLngLiteral } from "./mapTypes";

export const CreateLatLng = (position: LatLngLiteral) => new google.maps.LatLng(position);