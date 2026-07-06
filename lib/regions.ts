import type { Region } from "./types";

export interface RegionWithLabel extends Region {
  // Direction du tooltip Leaflet pour éviter les chevauchements
  // entre marqueurs proches.
  labelDir: "top" | "bottom" | "left" | "right";
}

// Secteurs couverts par Philippe Laroche (Est de Montréal + couronne nord-est).
export const REGIONS: RegionWithLabel[] = [
  { id: "hochelaga",      name: "Hochelaga-Maisonneuve", lat: 45.5560, lng: -73.5400, labelDir: "left" },
  { id: "anjou",          name: "Anjou",                 lat: 45.6110, lng: -73.5570, labelDir: "left" },
  { id: "saint-leonard",  name: "Saint-Léonard",         lat: 45.5880, lng: -73.6000, labelDir: "left" },
  { id: "montreal-nord",  name: "Montréal-Nord",         lat: 45.5960, lng: -73.6280, labelDir: "left" },
  { id: "rdp",            name: "Rivière-des-Prairies",  lat: 45.6480, lng: -73.5450, labelDir: "top" },
  { id: "montreal-est",   name: "Montréal-Est",          lat: 45.6300, lng: -73.5080, labelDir: "bottom" },
  { id: "pat",            name: "Pointe-aux-Trembles",   lat: 45.6650, lng: -73.4900, labelDir: "right" },
  { id: "charlemagne",    name: "Charlemagne",           lat: 45.7180, lng: -73.4820, labelDir: "right" },
  { id: "repentigny",     name: "Repentigny",            lat: 45.7420, lng: -73.4500, labelDir: "right" },
  { id: "lachenaie",      name: "Lachenaie",             lat: 45.7150, lng: -73.5150, labelDir: "top" },
  { id: "terrebonne",     name: "Terrebonne",            lat: 45.7000, lng: -73.6460, labelDir: "top" },
  { id: "mascouche",      name: "Mascouche",             lat: 45.7470, lng: -73.6030, labelDir: "top" },
];

// Centre approximatif pour la carte de fond (décorative).
export const REGION_CENTER: [number, number] = [45.655, -73.545];

// Bounds englobant tous les secteurs avec padding pour la carte interactive.
export const REGION_BOUNDS: [[number, number], [number, number]] = [
  [45.54, -73.68], // sud-ouest (englobe Hochelaga / Terrebonne)
  [45.77, -73.41], // nord-est (englobe Mascouche / Repentigny)
];
