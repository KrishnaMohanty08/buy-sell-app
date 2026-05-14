import crypto from 'crypto';

export const generateOtp = () => crypto.randomInt(100000, 999999).toString();
export const getOtpExpiry = () => new Date(Date.now() + 10 * 60 * 1000);

