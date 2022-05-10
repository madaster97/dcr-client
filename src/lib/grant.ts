import * as jose from "jose";
import { v4 } from "uuid";

import { KeyAlg } from "./register";
import { checkIsString, getNotStringError } from "./typeChecks";

type TokenResponseContext = Record<string, string | number>;
export const grant =
    async (client_id: string, token_endpoint: string, privateKey: jose.KeyLike, kid: string, alg: KeyAlg):
        Promise<{
            readonly access_token: string,
            readonly token_type: string,
            readonly scope: string,
            readonly expires_at: Date,
            readonly context: TokenResponseContext
        }> => {
        const assertion = await new jose.SignJWT({
            aud: token_endpoint,
            iss: client_id,
            sub: client_id,
            jti: v4()
        })
            .setProtectedHeader({ alg, kid, typ: 'JWT' })
            .setExpirationTime('5m').sign(privateKey);
        const body = new URLSearchParams({
            assertion,
            client_id,
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer"
        })
        const res = await fetch(token_endpoint, {
            method: 'POST',
            body
        });
        const { access_token, token_type, expires_in, scope, ...context } = (await res.json()) as TokenResponseContext;

        if (!checkIsString(access_token)) {
            return Promise.reject(getNotStringError('access_token', access_token))
        } else if (!checkIsString(token_type)) {
            return Promise.reject(getNotStringError('token_type', token_type))
        } else if (!checkIsString(scope)) {
            return Promise.reject(getNotStringError('scope', scope))
        }

        const expires_at = new Date();
        const expiresInInt: number =
            typeof expires_in === 'string'
                ? parseInt(expires_in)
                : expires_in;
        expires_at.setSeconds(expires_at.getSeconds() + expiresInInt)

        return {
            access_token,
            token_type,
            expires_at,
            scope,
            context
        }
    }