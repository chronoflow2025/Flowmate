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
        if (!uri) {
            console.error('MONGODB_URI not found in env or .env');
            process.exit(2);
        }

        console.log('Testing MongoDB URI connecting...');
        console.log('URI (hidden):', typeof uri === 'string' ? (uri.slice(0, 50) + (uri.length > 50 ? '...' : '')) : String(uri));

        const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
        await client.connect();
        console.log('Connected to MongoDB');
        const ping = await client.db().admin().ping();
        console.log('Ping result:', ping);
        await client.close();
        process.exit(0);
    } catch (err) {
        console.error('MongoDB connection test failed:');
        console.error(err && err.stack ? err.stack : err);
        process.exit(1);
    }
})();
