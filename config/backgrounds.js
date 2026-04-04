const BACKGROUND_CONFIGS = {
    1: {
        name: 'Classic Blue',
        filename: 'bg1.png',
        positions: {
            "203": [55, 355],
            "204": [55, 600],
            "205": [180, 770],
            "214": [855, 380],
            "211_1": [730, 190],
            "211_2": [145, 150],
            "avatar": [222, 150],
            "weapon": [680, 600],
            "pet": [725, 777]
        },
        sizes: {
            "203": [130, 130],
            "204": [130, 130],
            "205": [130, 130],
            "214": [130, 130],
            "211_1": [170, 130],
            "211_2": [170, 130],
            "avatar": [588, 860],
            "weapon": [300, 120],
            "pet": [120, 120]
        }
    },
    2: {
        name: 'Neon Purple',
        filename: 'bg2.png',
        positions: {
            "211_1": [190, 250],
            "211_2": [190, 750],
            "214": [190, 1250],
            "203": [2250, 240],
            "204": [2780, 240],
            "205": [2780, 760],
            "avatar": [800, 100],
            "weapon": [2250, 1250],
            "pet": [2250, 760]
        },
        sizes: {
            "203": [280, 280],
            "204": [280, 280],
            "205": [280, 280],
            "214": [280, 280],
            "211_1": [240, 240],
            "211_2": [240, 240],
            "avatar": [1500, 1700],
            "weapon": [750, 440],
            "pet": [260, 260]
        }
    },
    3: {
        name: 'Neon Red',
        filename: 'bg3.png',
        positions: {
            "203": [55, 355],
            "204": [55, 600],
            "205": [180, 770],
            "214": [855, 380],
            "211_1": [730, 190],
            "211_2": [145, 150],
            "avatar": [310, 200],
            "weapon": [680, 600],
            "pet": [725, 777]
        },
        sizes: {
            "203": [130, 130],
            "204": [130, 130],
            "205": [130, 130],
            "214": [130, 130],
            "211_1": [170, 130],
            "211_2": [170, 130],
            "avatar": [388, 660],
            "weapon": [300, 120],
            "pet": [100, 100]
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
