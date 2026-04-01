const { API_ENDPOINTS } = require('../config/api');
const { ultraFastFetch } = require('../utils/fetcher');

// ── Image bases ────────────────────────────────────────────────────────
const AVATAR_BASE  = 'https://raw.githubusercontent.com/bhimsainik123/FreeFire-Outfit/main/avatar';
const ITEMS_BASE   = 'https://raw.githubusercontent.com/bhimsainik123/Auto-update-Items/main/items';
const ITEMS1_BASE  = 'https://raw.githubusercontent.com/bhimsainik123/Auto-update-Items/main/items1';
const ITEMS2_BASE  = 'https://raw.githubusercontent.com/bhimsainik123/Auto-update-Items/main/items2';
const ITEMS3_BASE  = 'https://raw.githubusercontent.com/bhimsainik123/Auto-update-Items/main/items3';
const ITEMS4_BASE  = 'https://raw.githubusercontent.com/bhimsainik123/Auto-update-Items/main/items4';
const FALLBACK_ICON = 'https://iconapi.wasmer.app';

class ProfileService {

    // Try items folders in order until found
    static _itemUrl(id) {
        if (!id) return null;
        const clean = String(id).replace(/\.(png|jpg|jpeg|webp)$/i, '');
        // Primary: Auto-update-Items/items
        return `${ITEMS_BASE}/${clean}.png`;
    }

    // Fallback icon URL
    static _fallbackItemUrl(id) {
        return `${FALLBACK_ICON}/${id}`;
    }

    static _avatarUrl(avatarId) {
        if (!avatarId) return null;
        return `${AVATAR_BASE}/${avatarId}.jpg`;
    }

    static _petUrl(petId) {
        if (!petId) return null;
        return `${ITEMS_BASE}/${petId}.png`;
    }

    static async fetchProfileData(uid) {
        const url = `${API_ENDPOINTS[0]}?uid=${uid}`;
        const response = await ultraFastFetch(url);
        if (!response?.data) throw new Error('Profile fetch failed');
        return response.data;
    }

    static getAvatarId(profileData) {
        if (profileData?.profileInfo?.avatarId) return profileData.profileInfo.avatarId;
        return 101000016; // default
    }

    static buildImageRequests(profileData, bgConfig) {
        const pos   = bgConfig.positions;
        const sizes = bgConfig.sizes;

        const clothes  = profileData.profileInfo?.clothes
                      || profileData.profileInfo?.equippedItems
                      || [];
        const weapons  = profileData.basicInfo?.weaponSkinShows || [];
        const petId    = profileData.petInfo?.skinId || profileData.petInfo?.id;
        const avatarId = this.getAvatarId(profileData);

        const imageRequests = [];
        const overlayData   = [];

        // ── 1. CLOTHES ────────────────────────────────────────────────
        let cnt211 = 1;
        for (const id of clothes) {
            if (!id) continue;
            const idStr = String(id);
            const key   = idStr.startsWith('211') ? `211_${cnt211++}` : idStr.substring(0, 3);
            if (pos[key] && sizes[key]) {
                imageRequests.push({
                    url: this._itemUrl(id),
                    fallbackUrl: this._fallbackItemUrl(id),
                    width: sizes[key][0],
                    height: sizes[key][1]
                });
                overlayData.push(pos[key]);
            }
        }

        // ── 2. WEAPON SKIN ────────────────────────────────────────────
        if (weapons[0] && pos.weapon && sizes.weapon) {
            imageRequests.push({
                url: this._itemUrl(weapons[0]),
                fallbackUrl: this._fallbackItemUrl(weapons[0]),
                width: sizes.weapon[0],
                height: sizes.weapon[1]
            });
            overlayData.push(pos.weapon);
        }

        // ── 3. PET ────────────────────────────────────────────────────
        if (petId && pos.pet && sizes.pet) {
            imageRequests.push({
                url: this._petUrl(petId),
                fallbackUrl: this._fallbackItemUrl(petId),
                width: sizes.pet[0],
                height: sizes.pet[1]
            });
            overlayData.push(pos.pet);
        }

        // ── 4. CHARACTER (last - renders on top) ──────────────────────
        if (avatarId && pos.avatar && sizes.avatar) {
            imageRequests.push({
                url: this._avatarUrl(avatarId),
                fallbackUrl: null,
                width: sizes.avatar[0],
                height: sizes.avatar[1]
            });
            overlayData.push(pos.avatar);
        }

        console.log(`🎯 avatar: ${this._avatarUrl(avatarId)}`);
        console.log(`👕 clothes: ${clothes.join(', ')}`);
        console.log(`🔫 weapon: ${weapons[0]}`);
        console.log(`🐾 pet: ${petId}`);

        return {
            imageRequests,
            overlayData,
            metadata: { avatarId, clothes, weapons, petId }
        };
    }
}

module.exports = ProfileService;
