"use client";

import Script from "next/script";

// ⚠️ PAR-COURTIER — projet Clarity de Philippe Laroche.
// Si tu réutilises ce projet pour un AUTRE courtier, change cette valeur
// (ou définis NEXT_PUBLIC_CLARITY_PROJECT_ID sur Vercel, qui a priorité).
// `||` (pas `??`) pour que le défaut s'applique aussi si la variable est
// définie mais VIDE sur Vercel.
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "xr4bykze21";

export default function Clarity() {
  if (!CLARITY_PROJECT_ID) return null;
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
      `}
    </Script>
  );
}
