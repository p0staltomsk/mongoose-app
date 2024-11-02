import express, { Router, Request, Response } from 'express';
import { Element } from '../models/element';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const elements = await Element.find();
    res.json(elements);
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
});

export default router;
