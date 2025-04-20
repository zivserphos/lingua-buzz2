import React, { useEffect, useRef } from "react";
import { AD_IDS } from "./adConstants";

export default function RightSideAd() {
  return (
    <div className="ad-container right-side-ad" style={{ width: '160px', height: '600px' }}>
      <ins 
        className="adsbygoogle"
        id={AD_IDS.RIGHT}
        style={{display: 'block', width: '160px', height: '600px'}}
        data-ad-client="ca-pub-7696906136083035"
        data-ad-slot="1007647680"
        data-ad-format="rectangle"
        data-full-width-responsive="false" />
    </div>
  );
}
