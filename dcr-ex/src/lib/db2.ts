import { openDB, DBSchema } from 'idb';

export type Client = {
    client_id: string,
    iss: string,
    patient: string,
    encounter: string,
    fhirUser: string,
    // privateKey: CryptoKey,
    // publicKey: CryptoKey,
    kid: string,
    extra: Object,
    creationTime: Date
}

type PrimaryKey = [string, string];
type PrimaryKeyObject = { client_id: string, iss: string };
function parsePrimaryKey(
    [client_id, iss]: PrimaryKey): PrimaryKeyObject {
    return { client_id, iss };
}
function serializePrimaryKey(
    { client_id, iss }: PrimaryKeyObject): PrimaryKey {
    return [client_id, iss];
}

interface ClientDBSchema extends DBSchema {
    'clients': {
        key: PrimaryKey;
        value: Client;
        indexes: { 'by-iss': string }
    };
}

const dbPromise = openDB<ClientDBSchema>('dcr-ex', 1, {
    upgrade(db) {
        db.createObjectStore('clients', {
            keyPath: ['client_id', 'iss']
        }).createIndex('by-iss', 'iss', { unique: false });
    }
});

export async function get(key: PrimaryKeyObject) {
    return (await dbPromise).get('clients', serializePrimaryKey(key));
};
export async function set(key: PrimaryKeyObject, val: Client) {
    return (await dbPromise).put('clients', val, serializePrimaryKey(key));
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