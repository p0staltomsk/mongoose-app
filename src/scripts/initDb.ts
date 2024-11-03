import mongoose from 'mongoose';
import { Element } from '../models/element';

const MONGODB_URI = 'mongodb://admin:password123@127.0.0.1:27019/periodic-table?authSource=admin';

async function initDb() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Очистим существующие данные
    await Element.deleteMany({});
    console.log('Cleared existing data');

    // Добавим первое вечное сердце
    const firstHeart = new Element({
      name: 'OLOLOSHA',
      symbol: '❤️‍🔥',
      mass: '∞',
      isPermanent: true,
      number: 119
    });

    await firstHeart.save();
    console.log('Added first permanent heart: OLOLOSHA');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb(); 