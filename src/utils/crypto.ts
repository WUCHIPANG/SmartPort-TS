import CryptoJS from 'crypto-js'
// 如果你的 TS 對 default import 有意見，改用：
// import * as CryptoJS from 'crypto-js'

export type AESMode = keyof typeof CryptoJS.mode;     // 'ECB' | 'CBC' | ...
export type AESPadding = keyof typeof CryptoJS.pad;   // 'Pkcs7' | 'ZeroPadding' | ...

export interface AESConfig {
  iv?: string;           // 只有 CBC 等需要，ECB 會忽略
  mode?: AESMode;        // 預設 'ECB'
  padding?: AESPadding;  // 預設 'Pkcs7'
}

// BASE64 加/解密
export const BASE64 = {
  encrypt(data: string): string {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data))
  },
  decrypt(cipher: string): string {
    return CryptoJS.enc.Base64.parse(cipher).toString(CryptoJS.enc.Utf8)
  },
  decryptUrl(cipher: string): string {
    const fixed = (cipher + '===')
      .slice(0, cipher.length + (cipher.length % 4))
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    return CryptoJS.enc.Base64.parse(fixed).toString(CryptoJS.enc.Utf8)
  },
}

// AES 加/解密
export const AES = {
  encrypt(data: string, secretKey: string, config: AESConfig = {}): string {
    if (secretKey.length % 8 !== 0) {
      console.warn('[error]: 秘鑰長度需為8的倍數，否則解密將會失敗。')
    }
    const result = CryptoJS.AES.encrypt(
      data,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        iv: CryptoJS.enc.Utf8.parse(config.iv ?? ''),
        mode: CryptoJS.mode[config.mode ?? 'ECB'],
        padding: CryptoJS.pad[config.padding ?? 'Pkcs7'],
      }
    )
    return result.toString()
  },

  decrypt(cipher: string, secretKey: string, config: AESConfig = {}): string {
    const result = CryptoJS.AES.decrypt(
      cipher,
      CryptoJS.enc.Utf8.parse(secretKey),
      {
        iv: CryptoJS.enc.Utf8.parse(config.iv ?? ''),
        mode: CryptoJS.mode[config.mode ?? 'ECB'],
        padding: CryptoJS.pad[config.padding ?? 'Pkcs7'],
      }
    )
    return CryptoJS.enc.Utf8.stringify(result)
  },
}