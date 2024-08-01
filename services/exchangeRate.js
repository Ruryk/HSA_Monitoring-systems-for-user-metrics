import fetch from 'node-fetch';

/**
 * Fetches the current USD to UAH exchange rate from the NBU API
 * @returns {Promise<number>} The exchange rate
 */
export const getUsdToUahRate = async () => {
    const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json';
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data[0].rate;
    } catch (error) {
        console.error('Error fetching exchange rate:', error);
        return null;
    }
};