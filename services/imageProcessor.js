const Jimp = require('jimp');
const { axiosInstance } = require('../config/api');
const { ULTRA_CONCURRENCY } = require('../config/constants');

class ImageProcessor {

    static async fetchBuffer(url) {
        const res = await axiosInstance.get(url, {
            responseType: 'arraybuffer',
            timeout: 10000,
            maxRedirects: 5,
            validateStatus: s => s === 200
        });
        return Buffer.from(res.data);
    }

    // APNG fix: remove acTL and fcTL chunks, keep only IHDR+IDAT+IEND
    static fixApng(buffer) {
        const PNG_SIG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
        if (!buffer.slice(0, 8).equals(PNG_SIG)) return buffer;

        const chunks = [];
        let i = 8;
        while (i < buffer.length) {
            const len = buffer.readUInt32BE(i);
            const type = buffer.slice(i + 4, i + 8).toString('ascii');
            const chunkTotal = 12 + len;
            // Skip APNG-specific chunks
            if (!['acTL', 'fcTL', 'fdAT'].includes(type)) {
                chunks.push(buffer.slice(i, i + chunkTotal));
            }
            i += chunkTotal;
        }
        return Buffer.concat([PNG_SIG, ...chunks]);
    }

    static async processImage(req) {
        const { urls, width, height } = req;

        for (const url of urls) {
            try {
                let buffer = await this.fetchBuffer(url);
                
                // Fix APNG before Jimp reads it
                buffer = this.fixApng(buffer);

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
