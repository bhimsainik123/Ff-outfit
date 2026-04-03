const BACKGROUND_CONFIGS = {
    1: {
        name: 'Classic Blue',
        filename: 'bg1.png',
        // 1024x1024 - hexagon layout (purple)
        // Left col hexagons: top(~80,80), mid(~60,340), lower(~60,560), bottom(~100,760)
        // Right col hexagons: top(~720,130), mid(~760,370)
        // Weapon rectangle: (~620,580) weapon box
        // Pet hexagon: (~700,760)
        positions: {
            "211_1": [75,  60],   // top-left big hexagon - hair
            "214":   [45, 330],   // left-mid hexagon - top wear
            "204":   [45, 545],   // left-lower hexagon - bottom
            "205":   [90, 755],   // bottom-left hexagon - shoes
            "211_2": [715, 110],  // top-right hexagon - mask/face2
            "203":   [755, 360],  // right-mid hexagon - face
            "avatar":[195,  10],  // character center
            "weapon":[615, 575],  // weapon rectangle box
            "pet":   [695, 755]   // pet hexagon bottom-right
        },
        sizes: {
            "211_1": [195, 195],
            "214":   [175, 175],
            "204":   [175, 175],
            "205":   [175, 175],
            "211_2": [175, 175],
            "203":   [175, 175],
            "avatar":[590, 980],
            "weapon":[260, 150],
            "pet":   [175, 175]
        }
    },
    2: {
        name: 'Neon Blue',
        filename: 'bg2.png',
        // 1480x796 - square box layout (aimguard style)
        // Left col boxes: top(~65,85), mid(~65,315), bottom(~65,540)
        // Right top row: (~990,85) and (~1230,85)
        // Right mid row: (~990,315) and (~1230,315)
        // Right weapon box: (~920,545) big rectangle
        positions: {
            "211_1": [65,  85],   // left-top box - hair
            "214":   [65, 315],   // left-mid box - top wear
            "203":   [65, 540],   // left-bottom box - face
            "211_2": [990, 85],   // right-top-left box - mask
            "204":   [1230, 85],  // right-top-right box - bottom
            "pet":   [990, 315],  // right-mid-left box - pet
            "205":   [1230, 315], // right-mid-right box - shoes
            "weapon":[920, 545],  // big weapon rectangle bottom-right
            "avatar":[290,  20]   // character center
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
            "avatar":[550, 900]
        }
    },
    3: {
        name: 'Neon Red',
        filename: 'bg3.png',
        // 1024x1024 - hexagon layout (orange) - exact same slots as bg1
        positions: {
            "211_1": [75,  60],
            "214":   [45, 330],
            "204":   [45, 545],
            "205":   [90, 755],
            "211_2": [715, 110],
            "203":   [755, 360],
            "avatar":[195,  10],
            "weapon":[615, 575],
            "pet":   [695, 755]
        },
        sizes: {
            "211_1": [195, 195],
            "214":   [175, 175],
            "204":   [175, 175],
            "205":   [175, 175],
            "211_2": [175, 175],
            "203":   [175, 175],
            "avatar":[590, 980],
            "weapon":[260, 150],
            "pet":   [175, 175]
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
