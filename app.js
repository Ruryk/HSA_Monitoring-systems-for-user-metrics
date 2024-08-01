import express from 'express';
import fetch from 'node-fetch';
import https from 'https';
import { randomUUID } from 'node:crypto';

import dotenv from 'dotenv';

const dotenvConfig = dotenv.config().parsed;

const app = express();

const port = 3000;

// Function for getting the USD/UAH exchange rate
const getUsdToUahRate = async () => {
    const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[0].rate;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return null;
    }
}

// Function for sending data to Google Analytics
const sendEventToGa = async (eventName, eventParams) => {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${ dotenvConfig.MEASUREMENT_ID }&api_secret=${ dotenvConfig.API_SECRET }`;

    const payload = {
        client_id: randomUUID(),
        events: [{
            name: eventName,
            params: eventParams
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return new Error(`Failed to send data to Google Analytics: ${ response.statusText }`);
        }

        const data = await response.json();

        console.log('Google Analytics res data', data);
    } catch (error) {
        console.error('Error sending event to GA:', error);
    }
}

// Function for tracking and sending a course
const trackExchangeRate = async () => {
    const rate = await getUsdToUahRate();
    if (!rate) {
        console.error('Error getting usd rates');
        return;
    }
    const eventParams = {
        currency: 'UAH',
        exchange_rate: rate,
        timestamp: Math.floor(Date.now() / 1000)
    };
    await sendEventToGa('usd_to_uah_rate', eventParams);
}

// Launch the server and send data regularly
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${ port }`);

    // Calling a function for initial startup
    trackExchangeRate();

    // Using setInterval to run every 24 hours
    // setInterval(trackExchangeRate, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    setInterval(trackExchangeRate, 2 * 60 * 1000); // 2 minutes in milliseconds
});