// Services
import { getUsdToUahRate } from '../services/exchangeRate.js';
import { sendEventToGa } from '../services/googleAnalytics.js';

/**
 * Tracks the USD to UAH exchange rate and sends it to Google Analytics
 * @returns {Promise<void>}
 */
export const trackExchangeRate = async () => {
    const rate = await getUsdToUahRate();
    if (!rate) {
        console.error('Error getting USD rates');
        return;
    }
    const eventParams = {
        currency: 'UAH',
        exchange_rate: rate,
        timestamp: Math.floor(Date.now() / 1000)
    };
    await sendEventToGa('usd_to_uah_rate', eventParams);
};