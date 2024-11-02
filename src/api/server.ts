import type { Express, Request, Response, NextFunction } from 'express';
import express from 'express';
import type { CorsOptions } from 'cors';
import cors from 'cors';
import connectDB from '../db/connection';
import elementsRouter from './elements';

const app: Express = express();
const port: number = Number(process.env.PORT) || 4567;

// Middleware
const corsOptions: CorsOptions = {
  origin: 'http://localhost:5173'
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Routes
app.use('/api/elements', elementsRouter);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Check if port is in use
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
