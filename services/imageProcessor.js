const Jimp = require('jimp');
const { axiosInstance } = require('../config/api');
const { ULTRA_CONCURRENCY } = require('../config/constants');

class ImageProcessor {

    static async fetchBuffer(url) {
        const response = await axiosInstance.get(url, {
            responseType: 'arraybuffer',
            timeout: 6000
        });
        if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
        return Buffer.from(response.data);
    }

    static async processImage(req) {
        const { url, fallbackUrl, width, height } = req;
        let buffer = null;

        // Try primary URL
        try {
            buffer = await this.fetchBuffer(url);
        } catch (e) {
            console.log(`⚡ Primary fail: ${url.split('/').pop()} — trying fallback`);
            // Try fallback URL
            if (fallbackUrl) {
                try {
                    buffer = await this.fetchBuffer(fallbackUrl);
                } catch (e2) {
                    console.log(`⚡ Fallback fail: ${fallbackUrl.split('/').pop()}`);
                    return null;
                }
            } else {
                return null;
            }
        }

        if (!buffer) return null;

        try {
            const image = await Jimp.read(buffer);
            if (width && height) {
                image.contain(width, height,
                    Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
            }
            return await image.getBufferAsync(Jimp.MIME_PNG);
        } catch (e) {
            console.log(`⚡ Jimp error: ${e.message}`);
            return null;
        }
    }

    static async processAllImages(requests) {
        const results = [];
        for (let i = 0; i < requests.length; i += ULTRA_CONCURRENCY) {
            const batch = requests.slice(i, i + ULTRA_CONCURRENCY);
            const batchResults = await Promise.allSettled(
                batch.map(req => this.processImage(req))
            );
            results.push(...batchResults.map(r => r.status === 'fulfilled' ? r.value : null));
        }
        return results;
    }

    static async generateFinalImage(backgroundBuffer, overlays) {
        const base = await Jimp.read(backgroundBuffer);
        for (const overlay of overlays) {
            if (!overlay || !overlay.input) continue;
            try {
                const img = await Jimp.read(overlay.input);
                base.composite(img, overlay.left, overlay.top);
            } catch (e) {
                console.log('⚡ Overlay skip:', e.message);
            }
        }
        return await base.getBufferAsync(Jimp.MIME_PNG);
    }
}

module.exports = ImageProcessor;
