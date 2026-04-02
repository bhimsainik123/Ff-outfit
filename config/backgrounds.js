const BACKGROUND_CONFIGS = {
    1: {
        name: 'Classic Blue',
        filename: 'bg1.png',
        // 1024x1024 - same layout as bg3
        positions: {
            "211_1": [60,  60],   // hair top-left
            "211_2": [60,  280],  // hair2
            "214":   [60,  490],  // top wear
            "203":   [60,  700],  // face
            "204":   [750, 280],  // bottom
            "205":   [750, 490],  // shoes
            "avatar":[230, 80],   // character center
            "weapon":[650, 640],  // weapon bottom-right
            "pet":   [750, 700]   // pet bottom-right
        },
        sizes: {
            "211_1": [150, 150],
            "211_2": [150, 150],
            "214":   [150, 150],
            "203":   [150, 150],
            "204":   [150, 150],
            "205":   [150, 150],
            "avatar":[530, 850],
            "weapon":[200, 150],
            "pet":   [150, 150]
        }
    },
    2: {
        name: 'Neon Purple',
        filename: 'bg2.png',
        // 3264x1796
        positions: {
            "211_1": [190,  250],
            "211_2": [190,  750],
            "214":   [190, 1250],
            "203":   [2250, 240],
            "204":   [2780, 240],
            "205":   [2780, 760],
            "avatar":[900,  100],
            "weapon":[2250,1180],
            "pet":   [2250, 760]
        },
        sizes: {
            "211_1": [240, 240],
            "211_2": [240, 240],
            "214":   [280, 280],
            "203":   [280, 280],
            "204":   [280, 280],
            "205":   [280, 280],
            "avatar":[1000,1600],
            "weapon":[640, 440],
            "pet":   [240, 240]
        }
    },
    3: {
        name: 'Neon Red',
        filename: 'bg3.png',
        // 1024x1024 - copy exact from bg1
        positions: {
            "211_1": [60,  60],
            "211_2": [60,  280],
            "214":   [60,  490],
            "203":   [60,  700],
            "204":   [750, 280],
            "205":   [750, 490],
            "avatar":[230, 80],
            "weapon":[650, 640],
            "pet":   [750, 700]
        },
        sizes: {
            "211_1": [150, 150],
            "211_2": [150, 150],
            "214":   [150, 150],
            "203":   [150, 150],
            "204":   [150, 150],
            "205":   [150, 150],
            "avatar":[530, 850],
            "weapon":[200, 150],
            "pet":   [150, 150]
        }
    }
};

module.exports = {
    BACKGROUND_CONFIGS,
    getBackgroundConfig: (bgId) => {
        const id = parseInt(bgId) || 1;
        return BACKGROUND_CONFIGS[id] || BACKGROUND_CONFIGS[1];
    },
    getAllBackgrounds: () => Object.keys(BACKGROUND_CONFIGS).map(id => ({
        id: parseInt(id),
        name: BACKGROUND_CONFIGS[id].name
    }))
};
