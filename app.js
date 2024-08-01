import express from 'express';

// Routes
import { trackExchangeRate } from './routes/exchangeRate.js';

// Configs
import config from './config.js';

// Logger
import { log } from './utils/logger.js';

const app = express();
const port = config.port;

// Launch the server and send data regularly
app.listen(port, () => {
    log(`Server is running on http://localhost:${port}`);

    // Calling a function for initial startup
    trackExchangeRate();

    // Using setInterval to run every 24 hours
    // setInterval(trackExchangeRate, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    setInterval(trackExchangeRate, 2 * 60 * 1000); // 2 minutes in milliseconds
});