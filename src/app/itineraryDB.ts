import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ActivityDetail {
  date: string;
  title: string;
  type: string;
  duration: string;
  timeSlot: string;
  budget: string;
  location: string;
}

interface DayItinerary {
  date: string;
  details: ActivityDetail[];
}

interface Itinerary {
  id?: number;
  title: string;
  days: DayItinerary[];
}

interface ItineraryDB extends DBSchema {
  itineraries: {
    key: number;
    value: Itinerary;
    indexes: { 'by-title': string };
  };
}

const DB_NAME = 'NextStopDB';
const STORE_NAME = 'itineraries';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<ItineraryDB> | null = null;

export const initDB = async (): Promise<IDBPDatabase<ItineraryDB>> => {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await openDB<ItineraryDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-title', 'title');
      }
    },
  });

  return dbInstance;
};

export const getAllItineraries = async (): Promise<Itinerary[]> => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const getItinerary = async (id: number): Promise<Itinerary | undefined> => {
  const db = await initDB();
  return db.get(STORE_NAME, id);
};

export const addItinerary = async (itinerary: Omit<Itinerary, 'id'>): Promise<number> => {
  const db = await initDB();
  return db.add(STORE_NAME, itinerary as Itinerary);
};

export const updateItinerary = async (itinerary: Itinerary): Promise<number> => {
  const db = await initDB();
  return db.put(STORE_NAME, itinerary);
};

export const deleteItinerary = async (id: number): Promise<void> => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const clearAllItineraries = async (): Promise<void> => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};

// Custom event for cross-component updates
export const dispatchItinerariesUpdated = () => {
  window.dispatchEvent(new CustomEvent('itinerariesUpdated'));
};
