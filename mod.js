// 21 Haneli Rastgele Doğrulama Anahtarı Üretici
export function generate21DigitKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 21; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

console.log("[Emcük Mod] Güvenlik ve Anahtar modülü yüklendi.");
