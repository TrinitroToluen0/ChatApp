require("dotenv").config();

module.exports = {
    PORT: 3000,
    MONGO_URI: process.env.MONGO_URI,
    SESSION_SECRET: process.env.SESSION_SECRET
};
