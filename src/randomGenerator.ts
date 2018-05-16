

// const DEFAULT_SIZE = 1; /** size in bytes */
// const HAS_CRYPTO = typeof window !== 'undefined' && !!(window.crypto as any);

// export interface RandomGenerator { (sizeInBytes?: number): string; }
// export const cryptoGenerateRandom: RandomGenerator = (sizeInBytes = DEFAULT_SIZE) => {
//     const buffer = new Uint8Array(sizeInBytes);
//     if (HAS_CRYPTO) {
//         window.crypto.getRandomValues(buffer);
//     } else {
//         // fall back to Math.random() if nothing else is available
//         for (let i = 0; i < sizeInBytes; i += 1) {
//             buffer[i] = Math.random();
//         }
//     }
//     return bufferToString(buffer);
// };


// const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';




// export function bufferToString(buffer: Uint8Array) {
//     let state = [];
//     for (let i = 0; i < buffer.byteLength; i += 1) {
//         let index = (buffer[i] % CHARSET.length) | 0;
//         state.push(CHARSET[index]);
//     }
//     return state.join('');
// }