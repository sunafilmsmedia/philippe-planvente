"use client";

import Script from "next/script";

// ⚠️ PAR-COURTIER — pixel de Philippe Laroche.
// Si tu réutilises ce projet pour un AUTRE courtier, change cette valeur
// (ou définis NEXT_PUBLIC_META_PIXEL_ID sur Vercel, qui a priorité),
// sinon ses statistiques polluent le compte publicitaire de Philippe.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "1255433172926141";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  if (!PIXEL_ID) return null;
  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Helper pour fire un événement standard Meta (Lead, Purchase, etc.)
export function trackPixel(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

// Helper pour fire un événement personnalisé (custom conversion)
export function trackCustomPixel(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", event, params);
  }
}

// Informations utilisateur pour l'Advanced Matching de Meta.
// Meta auto-hash ces valeurs côté client avant envoi.
export interface AdvancedMatchingInfo {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

// Déclenche l'événement standard "Lead" avec Advanced Matching activé.
export function trackLeadWithMatching(
  user: AdvancedMatchingInfo,
  eventParams?: Record<string, unknown>
) {
  if (typeof window === "undefined" || !window.fbq || !PIXEL_ID) return;

  const userData: Record<string, string> = {};
  if (user.email) userData.em = user.email.trim().toLowerCase();
  if (user.phone) userData.ph = user.phone.replace(/\D/g, "");
  if (user.firstName) userData.fn = user.firstName.trim().toLowerCase();
  if (user.lastName) userData.ln = user.lastName.trim().toLowerCase();

  window.fbq("init", PIXEL_ID, userData);
  window.fbq("track", "Lead", eventParams);
}
