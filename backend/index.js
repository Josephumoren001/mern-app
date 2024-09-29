import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import mentorRoutes from './routes/mentor.route.js'; // Corrected 'MentorRoutes' to 'mentorRoutes' for consistency
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

dotenv.config();

class Server {
  constructor() {
    this.app = express(); // Changed from 'app = express()' to 'this.app = express()' to use 'this' properly
    this.configMiddleware(); // Use 'this' to call class methods
    this.setupDatabase();
    this.registerRoutes();
    this.startServer();
  }

  configMiddleware() {
    this.app.set('trust proxy', 1); // Use 'this.app' instead of 'app'

    this.app.use(
      helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
      })
    );

    this.app.use(
      cors({
        origin: [
          'http://localhost:8080', 
          'https://deskstones.com', 
          'https://www.deskstones.com'
        ],
        credentials: true, // Allows credentials (cookies) to be passed
      })
    );

    this.app.use((req, res, next) => {
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });

    // Request logging middleware
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      next();
    });

    this.app.use(express.json());
    this.app.use(cookieParser());

    // Rate Limiting middleware
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    });
    this.app.use(limiter);
  }

  setupDatabase() {
    mongoose
      .connect(process.env.MONGO, )
      .then(() => {
        console.log('MongoDB is connected');
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err.message);
      });
  }

  registerRoutes() {
    this.app.options('*', cors()); // Handle preflight requests (OPTIONS)

    // Registering routes
    this.app.use('/api/user', userRoutes);
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/post', postRoutes);
    this.app.use('/api/comment', commentRoutes);
    this.app.use('/api/mentor', mentorRoutes); // Consistent lowercase naming

    // Error handling middleware
    this.app.use((err, req, res, next) => {
      const statusCode = err.statusCode || 500;
      const message = err.message || 'Internal Server Error';
      console.error(err); // Log the error for debugging
      res.status(statusCode).json({
        success: false,
        statusCode,
        message,
      });
    });
  }

  startServer() {
    const PORT = process.env.PORT || 8080;
    this.app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}

// Create and start the server
new Server();
