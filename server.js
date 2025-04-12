const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const eurekaClient = require('./eureka-client');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Health check endpoint for Eureka
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Info endpoint for Eureka
app.get('/info', (req, res) => {
  res.status(200).json({
    app: 'ms-reclamation',
    version: '1.0.0',
    description: 'Microservice for handling reclamations'
  });
});

// Importing routes
const reclamationRoutes = require('./Routes/reclamationRoutes');

// Use the reclamation routes
app.use('/api/reclamations', reclamationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Register with Eureka server
    eurekaClient.start(error => {
      console.log(error || 'Registered with Eureka server');
    });
  }).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
  });
})
.catch(err => {
  console.error('MongoDB connection failed:', err);
  process.exit(1);
});

// Handle shutdown and deregister from Eureka
process.on('SIGINT', () => {
  eurekaClient.stop(error => {
    console.log(error || 'Deregistered from Eureka');
    process.exit();
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Close server & exit process
  process.exit(1);
});