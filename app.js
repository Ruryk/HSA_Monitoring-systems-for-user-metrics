import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

const MEASUREMENT_ID = 'G-LY3HP15H7J';
const API_SECRET = '7Ek7PdRPQtKVngPekvJVUg';
const CLIENT_ID = '323149412';  // Ви можете використовувати будь-який унікальний ID для клієнта

async function getUsdToUahRate() {
    const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json';
    try {
        const response = await axios.get(url);
        return response.data[0].rate;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
    }
}

async function sendEventToGa(eventName, eventParams) {
    const url = `https://google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
    const payload = {
        client_id: CLIENT_ID,
        events: [{
            name: eventName,
            params: eventParams
        }]
    };

    try {
        const response = await axios.post(url, payload);
        console.log('Event sent, status code:', response.status);
    } catch (error) {
        console.error('Error sending event to GA:', error.cause);
    }
}

async function trackExchangeRate() {
    const rate = await getUsdToUahRate();
    const eventParams = {
        currency: 'UAH',
        exchange_rate: rate,
        timestamp: Math.floor(Date.now() / 1000)
    };
    await sendEventToGa('usd_to_uah_rate', eventParams);
}

// Запуск серверу та регулярне відправлення даних
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);

    // Виклик функції для початкового запуску
    trackExchangeRate();

    // Використання setInterval для запуску кожні 24 години
    setInterval(trackExchangeRate, 5 * 60 * 1000); // 24 години у мілісекундах
});
