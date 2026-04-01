const { API_ENDPOINTS } = require('../config/api');
const { ultraFastFetch } = require('../utils/fetcher');
const { getBackgroundConfig } = require('../config/backgrounds');

const ICONS_BASE     = 'https://raw.githubusercontent.com/I-SHOW-AKIRU200/AKIRU-ICONS/main/ICONS';
const CHARACTER_BASE = 'https://raw.githubusercontent.com/sukhdaku/free-fire-chracter/main';
const BANNER_ID_BASE = 'https://raw.githubusercontent.com/bhimsainik123/All-Banner-free-fire/main/img_id';
const PET_BASE       = 'https://raw.githubusercontent.com/I-SHOW-AKIRU200/AKIRU-ICONS/main/ICONS';

class ProfileService {

    // ─── Avatar/Character ID ───────────────────────────────────────────
    static getAvatarId(profileData) {
        if (profileData?.profileInfo?.avatarId) return profileData.profileInfo.avatarId;
        const skills = profileData?.profileInfo?.equipedSkills
                    || profileData?.profileInfo?.EquippedSkills;
        if (!skills?.length) return 406;
        for (const skill of skills) {
            if (String(skill).endsWith('06')) return skill;
        }
        return 406;
    }

    // ─── URL builders ─────────────────────────────────────────────────
    static _iconUrl(id) {
        if (!id && id !== 0) return null;
        const clean = String(id).replace(/\.(png|jpg|jpeg|webp)$/i, '');
        return `${ICONS_BASE}/${clean}.png`;
    }

    static _characterUrl(id) {
        if (!id && id !== 0) return null;
        const clean = String(id).replace(/\.(png|jpg|jpeg|webp)$/i, '');
        return `${CHARACTER_BASE}/${clean}.png`;
    }

    static _bannerUrl(bannerId) {
        if (!bannerId) return null;
        return `${BANNER_ID_BASE}/${bannerId}.png`;
    }

    static _petUrl(petId) {
        if (!petId) return null;
        return `${PET_BASE}/${petId}.png`;
    }

    // ─── Fetch profile from API ────────────────────────────────────────
    static async fetchProfileData(uid) {
        const url = `${API_ENDPOINTS[0]}?uid=${uid}`;
        const response = await ultraFastFetch(url);
        if (!response?.data) throw new Error('Profile fetch failed');
        return response.data;
    }

    // ─── Build all image requests + overlay positions ─────────────────
    static buildImageRequests(profileData, bgConfig) {
        const pos   = bgConfig.positions;
        const sizes = bgConfig.sizes;

        // API fields
        const clothes = profileData.profileInfo?.clothes
                      || profileData.profileInfo?.equippedItems
                      || [];
        const weapons  = profileData.basicInfo?.weaponSkinShows || [];
        const petId    = profileData.petInfo?.skinId || profileData.petInfo?.id;
        const avatarId = this.getAvatarId(profileData);
        const bannerId = profileData.basicInfo?.bannerId;

        const imageRequests = [];
        const overlayData   = [];

        // ── 1. BANNER ──────────────────────────────────────────────────
        if (bannerId && pos.banner && sizes.banner) {
            imageRequests.push({ url: this._bannerUrl(bannerId), width: sizes.banner[0], height: sizes.banner[1] });
            overlayData.push(pos.banner);
        }

        // ── 2. CLOTHES ────────────────────────────────────────────────
        let cnt211 = 1;
        for (const id of clothes) {
            if (!id) continue;
            const idStr = String(id);
            const key   = idStr.startsWith('211') ? `211_${cnt211++}` : idStr.substring(0, 3);
            if (pos[key] && sizes[key]) {
                imageRequests.push({ url: this._iconUrl(id), width: sizes[key][0], height: sizes[key][1] });
                overlayData.push(pos[key]);
            }
        }

        // ── 3. WEAPON SKIN ────────────────────────────────────────────
        if (weapons[0] && pos.weapon && sizes.weapon) {
            imageRequests.push({ url: this._iconUrl(weapons[0]), width: sizes.weapon[0], height: sizes.weapon[1] });
            overlayData.push(pos.weapon);
        }

        // ── 4. PET ────────────────────────────────────────────────────
        if (petId && pos.pet && sizes.pet) {
            imageRequests.push({ url: this._petUrl(petId), width: sizes.pet[0], height: sizes.pet[1] });
            overlayData.push(pos.pet);
        }

        // ── 5. CHARACTER / AVATAR ─────────────────────────────────────
        if (avatarId && pos.avatar && sizes.avatar) {
            imageRequests.push({ url: this._characterUrl(avatarId), width: sizes.avatar[0], height: sizes.avatar[1] });
            overlayData.push(pos.avatar);
        }

        return {
            imageRequests,
            overlayData,
            metadata: { avatarId, clothes, weapons, petId, bannerId }
        };
    }
}

module.exports = ProfileService;
