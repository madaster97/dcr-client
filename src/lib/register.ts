import * as jose from "jose";

import { checkIsString, getNotStringError } from "./typeChecks";

type RegisterMetadata = Record<string, string | number>
export type KeyAlg = 'RS384' | 'ES384';
const createKeys = async (alg: KeyAlg) => jose.generateKeyPair(alg, { extractable: false })
    .then(async ({ privateKey, publicKey }) => {
        const jwk = await jose.exportJWK(publicKey)
        const kid = await jose.calculateJwkThumbprint(jwk);
        return {
            privateKey,
            publicKey,
            kid,
            jwks: {
                keys: [{ ...jwk, kid }]
            }
        }
    });

const register =
    async (
        initial_access_token: string,
        registration_endpoint: string,
        software_id: string,
        alg: KeyAlg):
        Promise<{
            readonly client_id: string,
            readonly kid: string,
            readonly privateKey: jose.KeyLike,
            readonly publicKey: jose.KeyLike,
            readonly metadata: RegisterMetadata
        }> => {
        const { jwks, kid, privateKey, publicKey } = await createKeys(alg);
        const body = JSON.stringify({ jwks, software_id });
        const res = await fetch(registration_endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${initial_access_token}`
            },
            body
        });
        const { client_id, ...metadata } = (await res.json()) as RegisterMetadata;

        if (!checkIsString(client_id)) {
            return Promise.reject(getNotStringError('client_id', client_id))
        }

        return {
            client_id,
            kid,
            privateKey,
            publicKey,
            metadata
        }
    }
export default register;