import { openDB, DBSchema } from 'idb';
import { GenerateKeyPairResult } from 'jose';

type KeyResult = GenerateKeyPairResult & {kid: string};

interface MyDB extends DBSchema {
    'keyval': {
        key: 'KEYS';
        value: KeyResult;
    };
}

const dbPromise = openDB<MyDB>('keyval-store', 1, {
    upgrade(db) {
        db.createObjectStore('keyval');
    },
});

export async function get(key: 'KEYS') {
    return (await dbPromise).get('keyval', key);
};
export async function set(key: 'KEYS', val: KeyResult) {
    return (await dbPromise).put('keyval', val, key);
};
export async function del(key: 'KEYS') {
    return (await dbPromise).delete('keyval', key);
};
export async function clear() {
    return (await dbPromise).clear('keyval');
};
export async function keys() {
    return (await dbPromise).getAllKeys('keyval');
};