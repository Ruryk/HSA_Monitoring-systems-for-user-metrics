import fetch from 'node-fetch';
import { randomUUID } from 'node:crypto';

// Configs
import config from '../config.js';

/**
 * Sends an event to Google Analytics
 * @param {string} eventName - The name of the event
 * @param {Object} eventParams - The parameters of the event
 * @returns {Promise<void>}
 */
export const sendEventToGa = async (eventName, eventParams) => {
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${ config.measurementId }&api_secret=${ config.apiSecret }`;

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
           console.error(`Failed to send data to Google Analytics: ${ response.statusText }`);
        }

        console.log('Event sent to Google Analytics');
    } catch (error) {
        console.error('Error sending event to GA:', error);
    }
};