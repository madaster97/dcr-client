import { ClientStore, register as registerClient } from 'dcr-client'
import pkceChallenge, { verifyChallenge } from 'pkce-challenge'

export const standalone = async (initialClientId: string, softwareId: string, iss: string): Promise<string> => {
    const url = `${iss}/metadata`;
    const headers = {
        'Epic-Client-ID': initialClientId
    };
    const resp = await fetch(url, { headers })
    const json = await resp.json();
    const authUrls = json.rest[0].security.extension[0].extension as { valueUri: string, url: 'token' | 'register' | 'authorize' }[];
    const register = authUrls.filter(({ url }) => url === 'register')[0].valueUri;
    const authorize = authUrls.filter(({ url }) => url === 'authorize')[0].valueUri;
    const token = authUrls.filter(({ url }) => url === 'token')[0].valueUri;

    const { code_verifier, code_challenge } = pkceChallenge();
    const { code_verifier: state_verifier, code_challenge: state } = pkceChallenge();
    // const { code_verifier: nonce_verifier, code_challenge: nonce } = pkceChallenge();

    const session = {
        register,
        token,
        initialClientId,
        softwareId,
        iss,
        code_verifier,
        state_verifier,
        // nonce_verifier
    }

    const queryString = new URLSearchParams({
        client_id: initialClientId,
        redirect_uri: window.location.origin + '/index.html',
        aud: iss,
        response_type: 'code',
        // scope: 'openid fhirUser',
        state,
        // nonce,
        code_challenge
    })

    window.sessionStorage.setItem('LAUNCH_SESSION', JSON.stringify(session))
    return `${authorize}?${queryString.toString()}`
}

export const token = async (): Promise<ClientStore.Client> => {
    const rawSession = window.sessionStorage.getItem('LAUNCH_SESSION');
    if (!rawSession) {
        return Promise.reject('No launch session found. Please launch again or enable session storage')
    }
    window.sessionStorage.removeItem('LAUNCH_SESSION');
    const { register,
        token,
        initialClientId,
        softwareId,
        iss,
        code_verifier,
        state_verifier,
        // nonce_verifier 
    } = JSON.parse(rawSession);

    const params = new URLSearchParams(window.location.search);
    if (params.has('error') || params.has('error_description')) {
        return Promise.reject(`Encountered error ${params.get('error')} [${params.get('error_description')}]`)
    }

    if (!params.has('code')) {
        return Promise.reject('Missing code response parameter')
    }

    if (!params.has('state')) {
        return Promise.reject('Missing state response parameter')
    }

    if (!verifyChallenge(state_verifier, params.get('state') || '')) {
        return Promise.reject('State verification failed')
    }

    const body = new URLSearchParams({
        redirect_uri: window.location.origin + '/index.html',
        client_id: initialClientId,
        grant_type: 'authorization_code',
        code_verifier,
        code: params.get('code') || ''
    })

    const resp = await fetch(token, { body });

    // Use this immediately, and only store in memory!
    const { access_token: initialAccessToken, patient } = await resp.json();

    const { client_id, kid, metadata, privateKey, publicKey } = await registerClient(initialAccessToken, register, softwareId, 'RS384');

    return {
        client_id,
        kid,
        creationTime: new Date(),
        publicKey,
        privateKey,
        token_endpoint: token,
        extra: {
            patient,
            iss
        },
        sub: 'Unknown'
    }
}