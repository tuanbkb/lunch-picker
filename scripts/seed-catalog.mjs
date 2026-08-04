import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, writeBatch } from 'firebase/firestore';
import { FOODS, PEOPLE } from './catalog-data.mjs';

function loadEnvLocal() {
  const content = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
  const env = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    env[key] = rest.join('=');
  }
  return env;
}

const env = loadEnvLocal();
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const batch = writeBatch(db);

FOODS.forEach((food, index) => {
  const { id, ...fields } = food;
  batch.set(doc(db, 'foods', id), { ...fields, order: index });
});

PEOPLE.forEach((name, index) => {
  batch.set(doc(db, 'people', slugify(name)), { name, order: index });
});

await batch.commit();
console.log(`Seeded ${FOODS.length} foods and ${PEOPLE.length} people from catalog-data.mjs.`);
