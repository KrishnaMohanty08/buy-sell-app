import express from 'express';
import protect from '../middleware/authMiddleware.js';
import asyncHandler from '../utils/asyncHandler.js';
import prisma from '../prisma/client.js';

const router = express.Router();
router.use(protect);

// Get all addresses
router.get('/', asyncHandler(async (req, res) => {
  const addresses = await prisma.address.findMany({
    where: { userId: req.user.id },
    orderBy: { isDefault: 'desc' }
  });
  res.json({ addresses });
}));

// Create address
router.post('/', asyncHandler(async (req, res) => {
  const { fullName, phone, street, city, state, postalCode, country } = req.body;
  
  if (!fullName || !phone || !street || !city || !state || !postalCode) {
    return res.status(400).json({ message: 'All address fields are required' });
  }

  const address = await prisma.address.create({
    data: {
      fullName: fullName.trim(),
      phone: phone.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country || 'India',
      userId: req.user.id,
    }
  });
  
  res.status(201).json({ address });
}));

export default router;