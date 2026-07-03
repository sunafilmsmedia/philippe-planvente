"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { REGION_CENTER } from "@/lib/regions";

// Force Leaflet à recalculer sa taille au montage → garantit le chargement
// des tuiles même quand le conteneur est initialisé à 0px.
function InvalidateOnMount() {
  const map = useMap();
  useEffect(() => {
    const fix = () => map.invalidateSize();
    fix();
    const t1 = setTimeout(fix, 200);
    const t2 = setTimeout(fix, 800);
    window.addEventListener("resize", fix);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", fix);
    };
  }, [map]);
  return null;
}

// Fond : carte de Montréal en ton-sur-ton beige (même couleur que le fond).
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" style={{ background: "#ece4d8" }}>
      {/* Carte, désaturée et éclaircie */}
      <div
        className="map-no-interaction absolute inset-0"
        style={{ filter: "grayscale(1) brightness(1.1) contrast(0.82)" }}
      >
        <MapContainer
          center={REGION_CENTER}
          zoom={11}
          zoomControl={false}
          attributionControl={true}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          boxZoom={false}
          keyboard={false}
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap, &copy; CARTO'
            subdomains={["a", "b", "c", "d"]}
          />
          <InvalidateOnMount />
        </MapContainer>
      </div>

      {/* Teinte beige (multiply) — colore la carte dans le ton du fond */}
      <div
        className="absolute inset-0"
        style={{ background: "#e6dcc9", mixBlendMode: "multiply", opacity: 0.55 }}
      />

      {/* Voile radial pour la lisibilité du texte central */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 32%, rgba(236,228,216,0) 0%, rgba(236,228,216,0.35) 55%, rgba(236,228,216,0.82) 100%)",
        }}
      />
    </div>
  );
}
