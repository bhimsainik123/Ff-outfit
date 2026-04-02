const Jimp = require('jimp');
const { axiosInstance } = require('../config/api');
const { ULTRA_CONCURRENCY } = require('../config/constants');

class ImageProcessor {

    static async fetchBuffer(url) {
        const res = await axiosInstance.get(url, { responseType: 'arraybuffer', timeout: 6000 });
        if (res.status !== 200) throw new Error(`HTTP ${res.status}`);
        return Buffer.from(res.data);
    }

    // Try each URL in order, return first success
    static async processImage(req) {
        const { urls, width, height } = req;
        let buffer = null;

        for (const url of urls) {
            try {
                buffer = await this.fetchBuffer(url);
                if (buffer) break;
            } catch (e) {
                console.log(`⚡ Skip: ${url.split('/').pop()}`);
            }
        }

        if (!buffer) return null;

        try {
            const img = await Jimp.read(buffer);
            if (width && height) {
                img.contain(width, height,
                    Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
            }
            return await img.getBufferAsync(Jimp.MIME_PNG);
        } catch (e) {
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
            if (!overlay?.input) continue;
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
