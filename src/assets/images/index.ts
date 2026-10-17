import heroFloralNails from './naile_hero_floral_nails_1792220607665.jpg';
import salonInteriorChic from './naile_salon_interior_1792220629596.jpg';
import polishDripping from './naile_polish_dripping_1792220645602.jpg';
import serviceManicure from './naile_service_manicure_1792220660484.jpg';
import servicePedicure from './naile_service_pedicure_1792220677940.jpg';
import serviceNailSpa from './naile_service_nail_spa_1792220698123.jpg';
import nailArt from './nail_art_couture_showcase_1791786283381.jpg';
import facialGlow from './beauty_facial_glow_portrait_1791786295901.jpg';
import studioInterior from './studio_interior_warm_ivory_1791786307960.jpg';
import founder from './founder_ketna_portrait_1791786317917.jpg';
import heroLuxuryStudio from './hero_luxury_studio_editorial_1791786271003.jpg';

export const ASSET_IMAGES = {
  hero: heroFloralNails,
  heroFloralNails,
  salonInteriorChic,
  polishDripping,
  serviceManicure,
  servicePedicure,
  serviceNailSpa,
  nailArt,
  facialGlow,
  studioInterior,
  founder,
  heroLuxuryStudio,
};

const filenameMap: Record<string, string> = {
  'naile_hero_floral_nails_1792220607665.jpg': heroFloralNails,
  'naile_salon_interior_1792220629596.jpg': salonInteriorChic,
  'naile_polish_dripping_1792220645602.jpg': polishDripping,
  'naile_service_manicure_1792220660484.jpg': serviceManicure,
  'naile_service_pedicure_1792220677940.jpg': servicePedicure,
  'naile_service_nail_spa_1792220698123.jpg': serviceNailSpa,
  'nail_art_couture_showcase_1791786283381.jpg': nailArt,
  'beauty_facial_glow_portrait_1791786295901.jpg': facialGlow,
  'studio_interior_warm_ivory_1791786307960.jpg': studioInterior,
  'founder_ketna_portrait_1791786317917.jpg': founder,
  'hero_luxury_studio_editorial_1791786271003.jpg': heroLuxuryStudio,
};

export function resolveImageUrl(url?: string): string {
  if (!url) return heroFloralNails;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const filename = url.split('/').pop()?.split('?')[0];
  if (filename && filenameMap[filename]) {
    return filenameMap[filename];
  }
  return url;
}
