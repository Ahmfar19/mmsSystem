import Fingerprint from '@fingerprintjs/fingerprintjs';
import CryptoJS from 'crypto-js';

export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function omitKeys<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => {
        delete result[key];
    });
    return result;
}

export async function generateDeviceFingerprint(): Promise<string | null> {
    try {
        const fingerprint = await Fingerprint.load();
        const result = await fingerprint.get();
        // Use omitKeys to remove specified properties
        const components = omitKeys(result.components, [
            'screenResolution',
            'screenFrame',
            'fontPreferences',
            'domBlockers',
            'touchSupport',
            'pdfViewerEnabled',
            'plugins',
        ]);
        const visitorId = Fingerprint.hashComponents(components);
        return visitorId;
    } catch (error) {
        return null;
    }
}

export const handleEncrypt = (text: string, secretKey: string) => {
    const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
    return ciphertext;
};

export const handleDecrypt = (encryptedText: string, secretKey: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};
