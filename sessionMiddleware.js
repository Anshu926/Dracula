const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET, // Secure key for signing sessions
    resave: false, // Prevent saving unchanged sessions
    saveUninitialized: false, // Don't save empty sessions
    store: MongoStore.create({
        mongoUrl: process.env.ATLAS_DB_URL, // MongoDB Atlas URL
        ttl: 14 * 24 * 60 * 60, // Session expiration in seconds (14 days)
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        httpOnly: true, // Prevent client-side JS from accessing cookies
        maxAge: 14 * 24 * 60 * 60 * 1000, // Expire after 14 days
    },
});

module.exports = sessionMiddleware;
