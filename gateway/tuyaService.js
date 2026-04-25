const axios = require('axios');
const crypto = require('crypto');

// Configuration - Replace YOUR_TUYA_CLIENT_SECRET with your actual secret
const CLIENT_ID = '3ctuukrt3q3jk4uu9jcf';
const CLIENT_SECRET = process.env.TUYA_CLIENT_SECRET || 'bc8f61e5afd5441082843bf2064190e8';
const BASE_URL = 'https://openapi.tuyaus.com';

let cachedToken = {
  value: null,
  expiresAt: 0,
};

/**
 * Calculates the Tuya API signature based on the V2.0 protocol
 */
function calculateSign(clientId, t, accessToken, signStr, secret, nonce = '') {
  // Following Postman logic:
  // Token Request: clientId + timestamp + nonce + signStr
  // Business Request: clientId + accessToken + timestamp + nonce + signStr
  // (When accessToken is '', the formulas are identical)
  const str = clientId + accessToken + t + nonce + signStr;
  
  return crypto
    .createHmac('sha256', secret)
    .update(str)
    .digest('hex')
    .toUpperCase();
}

/**
 * Generates the stringToSign component (Method + Hash + Headers + URL)
 */
function getStringToSign(method, path, query = {}, body = '') {
  const contentHash = crypto.createHash('sha256').update(body).digest('hex');
  const headersStr = ''; // Usually empty unless Signature-Headers is used

  // Sort and build query string
  const sortedQuery = Object.keys(query)
    .sort()
    .map((key) => `${key}=${query[key]}`)
    .join('&');

  const url = sortedQuery ? `${path}?${sortedQuery}` : path;
  return `${method.toUpperCase()}\n${contentHash}\n${headersStr}\n${url}`;
}

/**
 * Fetches a valid access token, using a cached one if it hasn't expired.
 */
async function getTuyaAccessToken() {
  const now = Date.now();
  // Return cached token if valid (with 1-minute safety margin)
  if (cachedToken.value && now < cachedToken.expiresAt - 60000) {
    return cachedToken.value;
  }

  const t = now.toString();
  const path = '/v1.0/token?grant_type=1';
  const stringToSign = getStringToSign('GET', path, {}, '');
  const sign = calculateSign(CLIENT_ID, t, '', stringToSign, CLIENT_SECRET);

  try {
    const response = await axios.get(`${BASE_URL}${path}`, {
      headers: {
        'client_id': CLIENT_ID,
        'sign': sign,
        't': t,
        'sign_method': 'HMAC-SHA256',
        'nonce': '',
        'stringToSign': '' 
      }
    });

    if (response.data.success) {
      const { access_token, expire_time } = response.data.result;
      cachedToken.value = access_token;
      cachedToken.expiresAt = now + (expire_time * 1000);
      return access_token;
    } else {
      throw new Error(response.data.msg || 'Tuya Authentication Failed');
    }
  } catch (error) {
    console.error('Tuya Auth Error:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { getTuyaAccessToken, calculateSign, getStringToSign, CLIENT_ID, CLIENT_SECRET };