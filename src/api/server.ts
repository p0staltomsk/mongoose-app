import express from 'express';
import connectDB from '../db/connection';
import elementsRouter from './elements';

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(express.json());
app.use('/api/elements', elementsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
