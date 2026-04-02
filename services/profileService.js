const { API_ENDPOINTS } = require('../config/api');
const { ultraFastFetch } = require('../utils/fetcher');

const ITEMS_FOLDERS = [
    'https://raw.githubusercontent.com/bhimsainik123/Auto-update-Items/main/items',
    'https://raw.githubusercontent.com/bhimsainik123/Auto-update-Items/main/items1',
    'https://raw.githubusercontent.com/bhimsainik123/Auto-update-Items/main/items2',
    'https://raw.githubusercontent.com/bhimsainik123/Auto-update-Items/main/items3',
    'https://raw.githubusercontent.com/bhimsainik123/Auto-update-Items/main/items4',
];

class ProfileService {

    // Returns array of URLs to try (all folders)
    static _allUrls(id) {
        if (!id) return [];
        const clean = String(id).replace(/\.(png|jpg|jpeg|webp)$/i, '');
        return ITEMS_FOLDERS.map(base => `${base}/${clean}.png`);
    }

    static async fetchProfileData(uid) {
        const url = `${API_ENDPOINTS[0]}?uid=${uid}`;
        const response = await ultraFastFetch(url);
        if (!response?.data) throw new Error('Profile fetch failed');
        return response.data;
    }

    static getAvatarId(profileData) {
        if (profileData?.profileInfo?.avatarId) return profileData.profileInfo.avatarId;
        return 101000016;
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
                    urls: this._allUrls(id),
                    width: sizes[key][0],
                    height: sizes[key][1]
                });
                overlayData.push(pos[key]);
            }
        }

        // ── 2. WEAPON ─────────────────────────────────────────────────
        if (weapons[0] && pos.weapon && sizes.weapon) {
            imageRequests.push({
                urls: this._allUrls(weapons[0]),
                width: sizes.weapon[0],
                height: sizes.weapon[1]
            });
            overlayData.push(pos.weapon);
        }

        // ── 3. PET ────────────────────────────────────────────────────
        if (petId && pos.pet && sizes.pet) {
            imageRequests.push({
                urls: this._allUrls(petId),
                width: sizes.pet[0],
                height: sizes.pet[1]
            });
            overlayData.push(pos.pet);
        }

        // ── 4. CHARACTER (last - on top) ──────────────────────────────
        if (avatarId && pos.avatar && sizes.avatar) {
            imageRequests.push({
                urls: this._allUrls(avatarId),
                width: sizes.avatar[0],
                height: sizes.avatar[1]
            });
            overlayData.push(pos.avatar);
        }

        console.log(`🎯 avatar: ${avatarId}`);
        console.log(`👕 clothes: ${clothes.join(', ')}`);
        console.log(`🔫 weapon: ${weapons[0]}`);
        console.log(`🐾 pet: ${petId}`);

        return { imageRequests, overlayData, metadata: { avatarId, clothes, weapons, petId } };
    }
}

module.exports = ProfileService;
