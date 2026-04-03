const { API_ENDPOINTS } = require('../config/api');
const { ultraFastFetch } = require('../utils/fetcher');
const { getBackgroundConfig } = require('../config/backgrounds');

// New bases as requested
const ICONS_BASE = 'https://raw.githubusercontent.com/I-SHOW-AKIRU200/AKIRU-ICONS/main/ICONS';
// UPDATED CHARACTER BASE
const CHARACTER_BASE = 'https://raw.githubusercontent.com/sukhdaku/free-fire-chracter/main';
const DEFAULT_EXT = 'png';

class ProfileService {
    static getAvatarId(profileData) {
        if (profileData?.profileInfo?.avatarId) {
            return profileData.profileInfo.avatarId;
        }

        const skills = profileData?.profileInfo?.EquippedSkills;
        if (!skills?.length) return 406;

        for (const skill of skills) {
            if (String(skill).endsWith('06')) return skill;
        }
        return 406;
    }

    static async fetchProfileData(uid) {
        const profileUrl = `${API_ENDPOINTS[0]}?uid=${uid}`;
        const response = await ultraFastFetch(profileUrl);

        if (!response?.data) {
            throw new Error('Profile fetch failed');
        }

        return response.data;
    }

    static _makeIconUrl(id) {
        if (!id && id !== 0) return null;

        // already full URL
        if (typeof id === 'string' && (id.startsWith('http://') || id.startsWith('https://'))) return id;

        const clean = String(id).replace(/\.(png|jpg|jpeg|webp)$/i, '');
        return `${ICONS_BASE}/${clean}.${DEFAULT_EXT}`;
    }

    static _makeCharacterUrl(id) {
        if (!id && id !== 0) return null;

        // already full URL
        if (typeof id === 'string' && (id.startsWith('http://') || id.startsWith('https://'))) return id;

        const clean = String(id).replace(/\.(png|jpg|jpeg|webp)$/i, '');
        // CHARACTER URL NOW FROM YOUR REPO
        return `${CHARACTER_BASE}/${clean}.${DEFAULT_EXT}`;
    }

    static buildImageRequests(profileData, bgConfig) {
        const clothes = profileData.profileInfo?.equippedItems || [];
        const weapons = profileData.playerData?.weaponSkinShows || [];
        const petId = profileData.petInfo?.id;
        const avatarId = this.getAvatarId(profileData);

        const imageRequests = [];
        const overlayData = [];

        // Process clothes
        let cnt211 = 1;
        clothes.forEach(id => {
            if (!id) return;

            const idStr = String(id);
            const key = idStr.startsWith("211") ? `211_${cnt211++}` : idStr.substring(0, 3);
            const pos = bgConfig.positions[key];
            const size = bgConfig.sizes[key];

            if (pos && size) {
                const url = ProfileService._makeIconUrl(id);
                if (!url) return;

                imageRequests.push({
                    url,
                    width: size[0],
                    height: size[1]
                });
                overlayData.push(pos);
            }
        });

        // Add weapon
        if (weapons[0]) {
            const size = bgConfig.sizes?.weapon;
            const pos = bgConfig.positions?.weapon;
            const url = ProfileService._makeIconUrl(weapons[0]);

            if (url && size && pos) {
                imageRequests.push({
                    url,
                    width: size[0],
                    height: size[1]
                });
                overlayData.push(pos);
            }
        }

        // Add pet
        if (petId) {
            const size = bgConfig.sizes?.pet;
            const pos = bgConfig.positions?.pet;
            const url = ProfileService._makeIconUrl(petId);

            if (url && size && pos) {
                imageRequests.push({
                    url,
                    width: size[0],
                    height: size[1]
                });
                overlayData.push(pos);
            }
        }

        // Add avatar (character from your repo)
        {
            const size = bgConfig.sizes?.avatar;
            const pos = bgConfig.positions?.avatar;
            const url = ProfileService._makeCharacterUrl(avatarId);

            if (url && size && pos) {
                imageRequests.push({
                    url,
                    width: size[0],
                    height: size[1]
                });
                overlayData.push(pos);
            } else {
                // fallback: still push character url even if size/pos missing
                const fallbackUrl = ProfileService._makeCharacterUrl(avatarId);
                if (fallbackUrl) {
                    imageRequests.push({
                        url: fallbackUrl,
                        width: size ? size[0] : undefined,
                        height: size ? size[1] : undefined
                    });
                    overlayData.push(pos || [0, 0]);
                }
            }
        }

        return {
            imageRequests,
            overlayData,
            metadata: {
                avatarId,
                clothes,
                weapons,
                petId
            }
        };
    }
}

module.exports = ProfileService;