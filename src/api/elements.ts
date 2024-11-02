import express from 'express';
import { Element } from '../models/element';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const elements = await Element.find();
    res.json(elements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
