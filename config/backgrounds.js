const COMMON_LAYOUT = {
    positions: {
        "211_1": [65,  85],    // hair
        "214":   [65, 315],    // top wear
        "203":   [65, 540],    // face

        "211_2": [990, 85],    // mask
        "204":   [1230, 85],   // bottom
        "pet":   [990, 315],   // pet
        "205":   [1230, 315],  // shoes

        "weapon":[920, 545],   // weapon box

        // 🔥 BIG CHARACTER (FIXED)
        "avatar":[350, 10]
    },

    sizes: {
        "211_1": [175, 200],
        "214":   [175, 200],
        "203":   [175, 200],

        "211_2": [175, 175],
        "204":   [175, 175],
        "pet":   [175, 175],
        "205":   [175, 175],

        "weapon":[380, 170],

        // 🔥 PERFECT SIZE (NO CUT + BIG LOOK)
        "avatar":[500, 780]
    }
};

const BACKGROUND_CONFIGS = {
    1: {
        name: 'Classic Purple',
        filename: 'bg1.png',
        ...COMMON_LAYOUT
    },

    2: {
        name: 'Neon Blue (Perfect)',
        filename: 'bg2.png',
        ...COMMON_LAYOUT
    },

    3: {
        name: 'Neon Orange',
        filename: 'bg3.png',
        ...COMMON_LAYOUT
    }
};

module.exports = {
    BACKGROUND_CONFIGS,

    getBackgroundConfig: (bgId) => {
        const id = parseInt(bgId) || 1;
        return BACKGROUND_CONFIGS[id] || BACKGROUND_CONFIGS[1];
    },

    getAllBackgrounds: () =>
        Object.keys(BACKGROUND_CONFIGS).map(id => ({
            id: parseInt(id),
            name: BACKGROUND_CONFIGS[id].name
        }))
};