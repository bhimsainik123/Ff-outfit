const BACKGROUND_CONFIGS = {
    1: {
        name: 'Classic Purple',
        filename: 'bg1.png',
        // 1024x1024 - pixel perfect measured
        positions: {
            "211_1": [132, 140],   // top-left hex
            "214":   [44,  326],   // left-mid hex
            "204":   [47,  536],   // left-lower hex
            "205":   [104, 733],   // bot-left hex
            "211_2": [727, 143],   // top-right hex
            "203":   [741, 336],   // right-mid hex
            "weapon":[635, 595],   // weapon rect
            "pet":   [730, 777],   // pet small hex
            "avatar":[222,  20],   // character center-x=512, starts top
        },
        sizes: {
            "211_1": [137, 137],
            "214":   [190, 190],
            "204":   [180, 180],
            "205":   [185, 185],
            "211_2": [150, 150],
            "203":   [220, 220],
            "weapon":[360, 120],
            "pet":   [95,  95],
            "avatar":[580, 970],
        }
    },
    2: {
        name: 'Neon Blue',
        filename: 'bg2.png',
        // 3264x1796 - pixel perfect measured
        positions: {
            "203":   [267, 227],   // left-top box
            "214":   [268, 439],   // left-mid box
            "211_1": [267, 727],   // left-bot box
            "211_2": [2339, 227],  // right-top-left box
            "204":   [2863, 223],  // right-top-right box
            "pet":   [2340, 439],  // right-mid-left box
            "205":   [2863, 434],  // right-mid-right box
            "weapon":[2150, 1230], // weapon big box
            "avatar":[1150,  40],  // character center
        },
        sizes: {
            "203":   [114, 114],
            "214":   [113, 113],
            "211_1": [114, 114],
            "211_2": [114, 114],
            "204":   [113, 113],
            "pet":   [113, 113],
            "205":   [113, 113],
            "weapon":[750, 300],
            "avatar":[700, 1100],
        }
    },
    3: {
        name: 'Neon Orange',
        filename: 'bg3.png',
        // 1024x1024 - same as bg1 (same layout)
        positions: {
            "211_1": [132, 140],
            "214":   [44,  326],
            "204":   [47,  536],
            "205":   [104, 733],
            "211_2": [727, 143],
            "203":   [741, 336],
            "weapon":[635, 595],
            "pet":   [730, 777],
            "avatar":[222,  20],
        },
        sizes: {
            "211_1": [137, 137],
            "214":   [190, 190],
            "204":   [180, 180],
            "205":   [185, 185],
            "211_2": [150, 150],
            "203":   [220, 220],
            "weapon":[360, 120],
            "pet":   [95,  95],
            "avatar":[580, 970],
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
