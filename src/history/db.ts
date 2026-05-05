import { openDB, type IDBPDatabase } from 'idb';
import type { HistoryRecord } from '../api/types';

const DB_NAME = 'lemon-disease-history';
const DB_VERSION = 1;
const STORE_NAME = 'records';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt');
        }
      },
    });
  }
  return dbPromise;
}

export async function saveRecord(record: HistoryRecord): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, record);
}

export async function getAllRecords(): Promise<HistoryRecord[]> {
  const db = await getDB();
  const records = await db.getAll(STORE_NAME);
  return records.sort(
    (a: HistoryRecord, b: HistoryRecord) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function deleteRecord(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}

export async function clearAllRecords(): Promise<void> {
  const db = await getDB();
  await db.clear(STORE_NAME);
}
