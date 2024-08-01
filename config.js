import dotenv from 'dotenv';

dotenv.config();

/**
 * Configuration object containing environment variables
 * @type {Object}
 */
const config = {
    measurementId: process.env.MEASUREMENT_ID,
    apiSecret: process.env.API_SECRET,
    port: process.env.PORT || 3000,
};

export default config;