/* eslint-disable functional/prefer-readonly-type */
import { DBSchema, openDB } from 'idb';
import * as jose from "jose";

export type Client = {
    readonly client_id: string,
    readonly token_endpoint: string,
    readonly privateKey: jose.KeyLike,
    readonly publicKey: jose.KeyLike,
    readonly kid: string,
    readonly creationTime: Date,
    readonly sub: string,
    readonly extra: Record<string, unknown>
}

type PrimaryKey = readonly [string, string];
type PrimaryKeyObject = { readonly client_id: string, readonly token_endpoint: string };
function parsePrimaryKey(
    [client_id, token_endpoint]: PrimaryKey): PrimaryKeyObject {
    return { client_id, token_endpoint };
}
function serializePrimaryKey(
    { client_id, token_endpoint }: PrimaryKeyObject): PrimaryKey {
    return [client_id, token_endpoint];
}

type ClientDBSchema = DBSchema & {
    clients: {
        key: PrimaryKey;
        value: Client;
        indexes: {
            'by-token-endpoint': string
        }
    };
};

const dbPromise = openDB<ClientDBSchema>('dcr-client', 1, {
    upgrade(db) {
        db.createObjectStore('clients', {
            keyPath: ['client_id', 'token_endpoint']
        }).createIndex('by-token-endpoint', 'token_endpoint', { unique: false });
    }
});

export async function get(key: PrimaryKeyObject) {
    return (await dbPromise).get('clients', serializePrimaryKey(key));
};
export async function set(val: Client) {
    return (await dbPromise).put('clients', val);
};
export async function del(key: PrimaryKeyObject) {
    return (await dbPromise).delete('clients', serializePrimaryKey(key));
};
export async function clear() {
    return (await dbPromise).clear('clients');
};
export async function keys() {
    return (await dbPromise).getAllKeys('clients').then(keys => keys.map(parsePrimaryKey));
};
export async function getAll() {
    return (await dbPromise).getAll('clients');
};