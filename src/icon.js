import L from "leaflet";
import iconUrl from "./images/icon-location.svg";

export default L.icon({
    iconUrl,
    iconSize: [46, 56],
    iconAnchor: [23, 56],
    popupAnchor: [0, -56],
    className: 'custom-marker-icon'
});
