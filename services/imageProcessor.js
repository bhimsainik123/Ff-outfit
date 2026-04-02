const Jimp = require('jimp');
const { axiosInstance } = require('../config/api');
const { ULTRA_CONCURRENCY } = require('../config/constants');

class ImageProcessor {

    static async fetchBuffer(url) {
        try {
            const res = await axiosInstance.get(url, {
                responseType: 'arraybuffer',
                timeout: 10000,
                maxRedirects: 5,
                validateStatus: s => s === 200
            });
            return Buffer.from(res.data);
        } catch (e) {
            throw new Error(e.response?.status || e.message);
        }
    }

    static async processImage(req) {
        const { urls, width, height } = req;

        for (const url of urls) {
            try {
                const buffer = await this.fetchBuffer(url);
                const img = await Jimp.read(buffer);
                if (width && height) img.scaleToFit(width, height);
                console.log(`✅ ${url.split('/').pop()}`);
                return await img.getBufferAsync(Jimp.MIME_PNG);
            } catch (e) {
                console.log(`⚡ Skip: ${url.split('/').pop()} (${e.message})`);
            }
        }
        return null;
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
