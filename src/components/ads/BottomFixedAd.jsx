
import React, { useEffect, useRef } from "react";
import { AD_IDS } from "./adConstants";

export default function BottomFixedAd() {
  return (
    <div className="ad-container bottom-fixed-ad" style={{ width: '100%', height: '90px' }}>
      <ins 
        className="adsbygoogle"
        id={AD_IDS.BOTTOM}
        style={{display: 'block', width: '100%', height: '90px'}}
        data-ad-client="ca-pub-7696906136083035"
        data-ad-slot="9912041236"
        data-ad-format="horizontal"
        data-full-width-responsive="true" />
    </div>
  );
}
