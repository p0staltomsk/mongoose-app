import mongoose from 'mongoose';
import { Element } from '../models/element';

const elements = [
  {
    atomicNumber: 1,
    symbol: 'H',
    name: 'Hydrogen',
    atomicMass: 1.008,
    category: 'Nonmetal',
    color: '#FFFFFF',
    description: 'Lightest element'
  },
  {
    atomicNumber: 2,
    symbol: 'He',
    name: 'Helium',
    atomicMass: 4.003,
    category: 'Noble Gas',
    color: '#D9FFFF',
    description: 'Inert gas'
  },
  // Добавьте больше элементов по необходимости
];

async function initDb() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/periodic-table');
    console.log('Connected to MongoDB');

    // Очистим существующие данные
    await Element.deleteMany({});
    console.log('Cleared existing data');

    // Добавим новые элементы
    await Element.insertMany(elements);
    console.log('Added elements to database');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDb(); 