const fs = require('fs');
const { MongoClient } = require('mongodb');

function readEnv() {
    const p = './.env';
    if (!fs.existsSync(p)) return {};
    const raw = fs.readFileSync(p, 'utf8');
    const lines = raw.split('\n');
    const env = {};
    for (const l of lines) {
        const s = l.trim();
        if (!s || s.startsWith('#')) continue;
        const idx = s.indexOf('=');
        if (idx === -1) continue;
        const key = s.slice(0, idx);
        const val = s.slice(idx + 1);
        env[key] = val;
    }
    return env;
}

(async function () {
    try {
        const env = readEnv();
        const uri = process.env.MONGODB_URI || env.MONGODB_URI;
        const dbName = process.env.MONGODB_DB_NAME || env.MONGODB_DB_NAME || 'flowmate';
        if (!uri) {
            console.error('MONGODB_URI not found');
            process.exit(2);
        }

        console.log('Connecting to', dbName);
        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection('users');
        const userId = 'clerk-test-user-123';
        const doc = {
            userId,
            name: 'Test User',
            email: 'test@example.com',
            routine: { wake: '08:00', sleep: '23:00' },
            meta: { createdByScript: true },
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const res = await users.updateOne({ userId }, { $set: doc }, { upsert: true });
        console.log('Upsert result:', res.result || res);
        const found = await users.findOne({ userId });
        console.log('Found document:', found);
        await client.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err && err.stack ? err.stack : err);
        process.exit(1);
    }
})();
