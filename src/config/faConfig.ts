import { library, type IconPack } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import {
    faBottleWater,
    faBus,
    faChair,
    faChalkboard,
    faCloudSun,
    faComputer,
    faCookieBite,
    faCouch,
    faFan,
    faMugHot,
    faParking,
    faPlug,
    faPrint,
    faRestroom,
    faSchool,
    faSun,
    faTemperatureFull,
    faUserTie,
    faUtensils,
    faVault,
    faVolumeHigh,
    faVolumeLow,
    faVolumeMute,
    faWheelchairMove,
    faWifi,
} from '@fortawesome/free-solid-svg-icons';

export const CUSTOM_ICON_PACK = {
    faWifi,
    faVolumeMute,
    faVolumeLow,
    faVolumeHigh,
    faCloudSun,
    faCouch,
    faUserTie,
    faPlug,
    faChair,
    faSun,
    faChalkboard,
    faPrint,
    faVault,
    faMugHot,
    faUtensils,
    faBottleWater,
    faCookieBite,
    faWheelchairMove,
    faRestroom,
    faFan,
    faTemperatureFull,
    faComputer,
    faSchool,
    faBus,
    faParking,
};

export const FA_ICON_PACKS: IconPack[] = [far, CUSTOM_ICON_PACK];

export function setupFontAwesome() {
    library.add(...FA_ICON_PACKS);
}
