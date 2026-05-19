// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async() => {
    // Configuration for the retry logic
    const MAX_RETRIES = 5;
    let retries = 0;

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Atlas requires 'admin' as the authSource for most clusters
        authSource: 'admin',
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    };

    while (retries < MAX_RETRIES) {
        try {
            console.log(`[MongoDB] Attempting connection (Attempt ${retries + 1})...`);

            const conn = await mongoose.connect(process.env.MONGO_URI, options);

            console.log(`[MongoDB] Success: Host ${conn.connection.host}`);
            return; // Exit loop on success
        } catch (err) {
            retries += 1;
            console.error(`[MongoDB] Error: ${err.message}`);

            if (err.message.includes('bad auth')) {
                console.error('CRITICAL: Authentication failed. Check username, password, and URL encoding.');
            }

            if (retries >= MAX_RETRIES) {
                console.error('[MongoDB] Max retries reached. Booting backend in "Offline Mode".');
                break;
            }

            console.log(`[MongoDB] Retrying in 5 seconds...`);
            await new Promise(res => setTimeout(res, 5000));
        }
    }
};

module.exports = connectDB;