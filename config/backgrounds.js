const BACKGROUND_CONFIGS = {
    1: {
        name: 'Classic Blue',
        filename: 'bg1.png',
        // 1024x1024 hexagon layout
        // Left hexagons (top to bottom): ~(55,130), ~(40,350), ~(40,560), ~(80,760)
        // Right hexagons: ~(720,130), ~(755,370)
        // Weapon rect: ~(615,580) size ~280x140
        // Pet hexagon: ~(700,760)
        // Character center: starts at ~x=195, y=70 (below title)
        positions: {
            "211_1": [55,  130],
            "214":   [40,  350],
            "204":   [40,  560],
            "205":   [80,  760],
            "211_2": [720, 130],
            "203":   [755, 370],
            "avatar":[195,  70],
            "weapon":[615, 580],
            "pet":   [700, 760]
        },
        sizes: {
            "211_1": [190, 190],
            "214":   [180, 180],
            "204":   [180, 180],
            "205":   [180, 180],
            "211_2": [175, 175],
            "203":   [175, 175],
            "avatar":[570, 900],
            "weapon":[280, 140],
            "pet":   [175, 175]
        }
    },
    2: {
        name: 'Neon Blue',
        filename: 'bg2.png',
        // 1480x796 aimguard square box layout
        // bg2 actual pixel measurements:
        // Left col boxes: top(65,85 size~170x200), mid(65,315 size~170x200), bot(65,540 size~170x180)
        // Right top row: box1(990,85 size~175x175), box2(1230,85 size~175x175)
        // Right mid row: box3(990,315 size~175x175), box4(1230,315 size~175x175)
        // Weapon big rect: (920,545 size~390x175)
        // Character: center of image, x=450, y=10
        positions: {
            "203":   [65,  85],
            "211_2": [65,  315],
            "214":   [65,  540],
            "211_1": [990, 85],
            "204":   [1230, 85],
            "pet":   [990, 315],
            "205":   [1230,315],
            "weapon":[920, 545],
            "avatar":[450,  10]
        },
        sizes: {
            "203":   [170, 200],
            "211_2": [170, 200],
            "214":   [170, 180],
            "211_1": [175, 175],
            "204":   [175, 175],
            "pet":   [175, 175],
            "205":   [175, 175],
            "weapon":[390, 175],
            "avatar":[560, 760]
        }
    },
    3: {
        name: 'Neon Red',
        filename: 'bg3.png',
        // 1024x1024 - same as bg1
        positions: {
            "211_1": [55,  130],
            "214":   [40,  350],
            "204":   [40,  560],
            "205":   [80,  760],
            "211_2": [720, 130],
            "203":   [755, 370],
            "avatar":[195,  70],
            "weapon":[615, 580],
            "pet":   [700, 760]
        },
        sizes: {
            "211_1": [190, 190],
            "214":   [180, 180],
            "204":   [180, 180],
            "205":   [180, 180],
            "211_2": [175, 175],
            "203":   [175, 175],
            "avatar":[570, 900],
            "weapon":[280, 140],
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
