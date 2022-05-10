import * as jose from "jose";

export const createKeys = async () => jose.generateKeyPair('RS384', { extractable: false })
    .then(async ({ privateKey, publicKey }) => {
            const jwk = await jose.exportJWK(publicKey)
            const kid = await jose.calculateJwkThumbprint(jwk);
            return {
                privateKey,
                publicKey,
                kid
            }
    });
export const exportJWK = jose.exportJWK;