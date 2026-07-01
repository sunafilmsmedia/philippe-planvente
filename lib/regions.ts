import type { Region } from "./types";

export interface RegionWithLabel extends Region {
  // Direction du tooltip Leaflet pour éviter les chevauchements
  // entre marqueurs proches.
  labelDir: "top" | "bottom" | "left" | "right";
}

// Arrondissements couverts par Philippe Laroche (île de Montréal).
export const REGIONS: RegionWithLabel[] = [
  { id: "ville-marie",    name: "Ville-Marie",           lat: 45.5088, lng: -73.5617, labelDir: "right" },
  { id: "plateau",        name: "Plateau-Mont-Royal",    lat: 45.5232, lng: -73.5800, labelDir: "right" },
  { id: "rosemont",       name: "Rosemont",              lat: 45.5470, lng: -73.5900, labelDir: "right" },
  { id: "villeray",       name: "Villeray",              lat: 45.5560, lng: -73.6150, labelDir: "top" },
  { id: "ahuntsic",       name: "Ahuntsic-Cartierville", lat: 45.5570, lng: -73.6650, labelDir: "top" },
  { id: "saint-laurent",  name: "Saint-Laurent",         lat: 45.5100, lng: -73.7150, labelDir: "left" },
  { id: "cdn-ndg",        name: "Côte-des-Neiges",       lat: 45.4870, lng: -73.6300, labelDir: "left" },
  { id: "sud-ouest",      name: "Le Sud-Ouest",          lat: 45.4720, lng: -73.5830, labelDir: "bottom" },
  { id: "verdun",         name: "Verdun",                lat: 45.4560, lng: -73.5700, labelDir: "bottom" },
  { id: "lasalle",        name: "LaSalle",               lat: 45.4310, lng: -73.6280, labelDir: "bottom" },
  { id: "mhm",            name: "Hochelaga-Maisonneuve", lat: 45.5620, lng: -73.5400, labelDir: "right" },
  { id: "montreal-nord",  name: "Montréal-Nord",         lat: 45.5950, lng: -73.6280, labelDir: "top" },
  { id: "rdp-pat",        name: "Rivière-des-Prairies",  lat: 45.6350, lng: -73.5050, labelDir: "top" },
];

// Centre approximatif pour la carte de fond (décorative).
export const REGION_CENTER: [number, number] = [45.53, -73.62];

// Bounds englobant tous les secteurs avec padding pour la carte interactive.
export const REGION_BOUNDS: [[number, number], [number, number]] = [
  [45.42, -73.78], // sud-ouest (englobe LaSalle / Saint-Laurent)
  [45.66, -73.47], // nord-est (englobe RDP–PAT et Montréal-Nord)
];
