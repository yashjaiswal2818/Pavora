"use client";

import type { BackgroundMeta, BackgroundProps } from "./types";

export const meta: BackgroundMeta = {
  slug: "terrazzo",
  name: "Terrazzo",
  category: "Patterns",
  tech: "css",
  isDark: false,
};

/* Poured terrazzo: angular and rounded stone chips in coral, teal, mustard and
   charcoal scattered across a warm cement, down to the fine speckle between the
   larger pieces. Deliberately still — it's a floor, not an animation. */
const CHIPS =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='560' viewBox='0 0 800 560'%3E%3Cpolygon points='39,72 21,83 6,67 27,43' fill='%23e8e1d2'/%3E%3Ccircle cx='173' cy='36' r='11' fill='%23e0b25c'/%3E%3Cpolygon points='300,70 268,78 273,42' fill='%234f9e93'/%3E%3Cellipse cx='412' cy='40' rx='8' ry='5' fill='%23e0b25c' transform='rotate(151 412 40)'/%3E%3Ccircle cx='494' cy='50' r='16' fill='%233c3a38'/%3E%3Ccircle cx='644' cy='69' r='12' fill='%23e0b25c'/%3E%3Cellipse cx='758' cy='71' rx='14' ry='9' fill='%23d98b6f' transform='rotate(335 758 71)'/%3E%3Cellipse cx='35' cy='161' rx='13' ry='10' fill='%234f9e93' transform='rotate(348 35 161)'/%3E%3Cpolygon points='149,152 138,155 130,147 141,138' fill='%23e0b25c'/%3E%3Ccircle cx='262' cy='158' r='14' fill='%234f9e93'/%3E%3Cellipse cx='404' cy='181' rx='13' ry='10' fill='%23e8e1d2' transform='rotate(201 404 181)'/%3E%3Cpolygon points='541,204 521,207 521,186' fill='%23c75f53'/%3E%3Cellipse cx='627' cy='153' rx='20' ry='15' fill='%234f9e93' transform='rotate(197 627 153)'/%3E%3Cpolygon points='725,158 709,162 716,144' fill='%23e0b25c'/%3E%3Cpolygon points='37,287 29,290 25,282 33,276' fill='%23e8e1d2'/%3E%3Ccircle cx='143' cy='293' r='15' fill='%239bae86'/%3E%3Ccircle cx='259' cy='255' r='12' fill='%237d5a78'/%3E%3Cpolygon points='447,289 408,299 426,269' fill='%23c75f53'/%3E%3Ccircle cx='541' cy='279' r='20' fill='%233c3a38'/%3E%3Ccircle cx='626' cy='308' r='11' fill='%23e8e1d2'/%3E%3Cellipse cx='741' cy='301' rx='13' ry='8' fill='%23e8e1d2' transform='rotate(347 741 301)'/%3E%3Ccircle cx='58' cy='365' r='17' fill='%23e8e1d2'/%3E%3Cpolygon points='176,407 150,410 152,381' fill='%23d98b6f'/%3E%3Ccircle cx='320' cy='387' r='15' fill='%23d98b6f'/%3E%3Cellipse cx='427' cy='385' rx='19' ry='13' fill='%23d98b6f' transform='rotate(45 427 385)'/%3E%3Ccircle cx='542' cy='394' r='18' fill='%234f9e93'/%3E%3Cellipse cx='654' cy='393' rx='21' ry='14' fill='%237d5a78' transform='rotate(234 654 393)'/%3E%3Cellipse cx='776' cy='403' rx='14' ry='9' fill='%239bae86' transform='rotate(275 776 403)'/%3E%3Cellipse cx='50' cy='483' rx='12' ry='10' fill='%239bae86' transform='rotate(17 50 483)'/%3E%3Ccircle cx='198' cy='493' r='11' fill='%23e0b25c'/%3E%3Ccircle cx='275' cy='488' r='14' fill='%23d98b6f'/%3E%3Ccircle cx='387' cy='486' r='11' fill='%234f9e93'/%3E%3Ccircle cx='513' cy='525' r='19' fill='%23e8e1d2'/%3E%3Ccircle cx='647' cy='531' r='19' fill='%23d98b6f'/%3E%3Cpolygon points='721,524 710,529 711,516' fill='%23d98b6f'/%3E%3Ccircle cx='382' cy='166' r='2.5' fill='%23e8e1d2' opacity='0.55'/%3E%3Ccircle cx='243' cy='498' r='2.2' fill='%23e8e1d2' opacity='0.55'/%3E%3Ccircle cx='84' cy='203' r='1.6' fill='%23e8e1d2' opacity='0.55'/%3E%3Ccircle cx='791' cy='158' r='1.7' fill='%234f9e93' opacity='0.55'/%3E%3Ccircle cx='334' cy='388' r='1.2' fill='%234f9e93' opacity='0.55'/%3E%3Ccircle cx='509' cy='210' r='2.1' fill='%23e8e1d2' opacity='0.55'/%3E%3Ccircle cx='309' cy='224' r='1.7' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='361' cy='259' r='2.6' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='551' cy='122' r='2.1' fill='%23e0b25c' opacity='0.55'/%3E%3Ccircle cx='767' cy='122' r='1.3' fill='%237d5a78' opacity='0.55'/%3E%3Ccircle cx='48' cy='4' r='2.0' fill='%23d98b6f' opacity='0.55'/%3E%3Ccircle cx='73' cy='149' r='1.5' fill='%23e8e1d2' opacity='0.55'/%3E%3Ccircle cx='746' cy='535' r='2.5' fill='%237d5a78' opacity='0.55'/%3E%3Ccircle cx='631' cy='118' r='1.1' fill='%23d98b6f' opacity='0.55'/%3E%3Ccircle cx='467' cy='51' r='2.4' fill='%23c75f53' opacity='0.55'/%3E%3Ccircle cx='652' cy='449' r='1.8' fill='%237d5a78' opacity='0.55'/%3E%3Ccircle cx='197' cy='379' r='2.4' fill='%23c75f53' opacity='0.55'/%3E%3Ccircle cx='592' cy='489' r='1.1' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='714' cy='497' r='1.4' fill='%23e0b25c' opacity='0.55'/%3E%3Ccircle cx='691' cy='376' r='1.6' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='236' cy='521' r='2.4' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='618' cy='526' r='1.4' fill='%23d98b6f' opacity='0.55'/%3E%3Ccircle cx='728' cy='233' r='2.3' fill='%23d98b6f' opacity='0.55'/%3E%3Ccircle cx='385' cy='366' r='1.7' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='51' cy='373' r='1.7' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='431' cy='122' r='2.4' fill='%237d5a78' opacity='0.55'/%3E%3Ccircle cx='665' cy='371' r='2.5' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='597' cy='4' r='2.2' fill='%23e0b25c' opacity='0.55'/%3E%3Ccircle cx='93' cy='309' r='2.1' fill='%23c75f53' opacity='0.55'/%3E%3Ccircle cx='786' cy='57' r='1.6' fill='%23d98b6f' opacity='0.55'/%3E%3Ccircle cx='491' cy='335' r='1.7' fill='%23e0b25c' opacity='0.55'/%3E%3Ccircle cx='505' cy='184' r='2.2' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='654' cy='13' r='2.1' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='196' cy='73' r='1.1' fill='%237d5a78' opacity='0.55'/%3E%3Ccircle cx='164' cy='362' r='1.7' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='550' cy='502' r='1.1' fill='%234f9e93' opacity='0.55'/%3E%3Ccircle cx='488' cy='365' r='1.4' fill='%234f9e93' opacity='0.55'/%3E%3Ccircle cx='133' cy='196' r='2.5' fill='%237d5a78' opacity='0.55'/%3E%3Ccircle cx='212' cy='491' r='1.8' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='377' cy='235' r='1.3' fill='%237d5a78' opacity='0.55'/%3E%3Ccircle cx='26' cy='529' r='1.6' fill='%233c3a38' opacity='0.55'/%3E%3Ccircle cx='573' cy='474' r='1.8' fill='%239bae86' opacity='0.55'/%3E%3Ccircle cx='766' cy='128' r='2.2' fill='%23e0b25c' opacity='0.55'/%3E%3Ccircle cx='128' cy='268' r='2.1' fill='%237d5a78' opacity='0.55'/%3E%3Ccircle cx='537' cy='216' r='2.3' fill='%23e0b25c' opacity='0.55'/%3E%3Ccircle cx='509' cy='510' r='1.4' fill='%233c3a38' opacity='0.55'/%3E%3C/svg%3E\")";

export function Background({ playing = true, className }: BackgroundProps) {
  return (
    <div className={`trz-root ${className ?? ""}`} data-playing={playing} aria-hidden>
      <style>{`
        .trz-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background-color: #ece7dd;
          background-image: ${CHIPS};
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }
      `}</style>
    </div>
  );
}

export const code = `/* Terrazzo — poured stone chips on warm cement */
.bg-terrazzo {
  position: relative;
  overflow: hidden;
  background-color: #ece7dd;
  background-image: ${CHIPS};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}`;
