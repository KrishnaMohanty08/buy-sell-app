const crypto = require('crypto');

const generateOtp = () => crypto.randomInt(100000, 999999).toString();
const getOtpExpiry = () => new Date(Date.now() + 10 * 60 * 1000);

module.exports = { generateOtp, getOtpExpiry };