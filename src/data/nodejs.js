const nodejs = [
  {
    id: 'nd1',
    question: 'What is Node.js and why use it?',
    difficulty: 'basics',
    simple: 'Node.js is a JavaScript runtime built on Chrome\'s V8 engine that lets you run JavaScript on the server side. It uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, ideal for data-intensive real-time applications.',
    points: [
      { bold: 'Single-threaded', text: 'Uses one thread with event loop for concurrency' },
      { bold: 'Non-blocking I/O', text: 'Handles thousands of concurrent connections efficiently' },
      { bold: 'NPM ecosystem', text: 'Largest package registry in the world' },
      { bold: 'Full-stack JS', text: 'Same language on frontend and backend' },
      { bold: 'Real-time apps', text: 'Perfect for chat, gaming, live dashboards' },
    ],
    code: `const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Hello from Node.js!' }));
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
    tip: 'Mention that Node.js is ideal for I/O-heavy apps but NOT for CPU-intensive tasks. Your MERN stack experience shows you understand when to use it.',
  },
  {
    id: 'nd2',
    question: 'Explain the Node.js Event Loop in detail',
    difficulty: 'advanced',
    simple: 'The Event Loop is the mechanism that allows Node.js to perform non-blocking I/O operations despite being single-threaded. It has 6 phases: Timers → Pending Callbacks → Idle/Prepare → Poll → Check → Close Callbacks.',
    points: [
      { bold: 'Timers phase', text: 'Executes setTimeout and setInterval callbacks' },
      { bold: 'Pending callbacks', text: 'Executes I/O callbacks deferred from the previous loop' },
      { bold: 'Poll phase', text: 'Retrieves new I/O events; executes I/O callbacks' },
      { bold: 'Check phase', text: 'Executes setImmediate() callbacks' },
      { bold: 'Close callbacks', text: 'Executes close event callbacks (e.g., socket.on("close"))' },
      { bold: 'Microtasks', text: 'process.nextTick() and Promises run between each phase' },
    ],
    code: `console.log('1 - Start');

setTimeout(() => console.log('2 - setTimeout'), 0);
setImmediate(() => console.log('3 - setImmediate'));

process.nextTick(() => console.log('4 - nextTick'));
Promise.resolve().then(() => console.log('5 - Promise'));

console.log('6 - End');

// Output: 1, 6, 4, 5, 2, 3
// nextTick > Promise > setTimeout > setImmediate
// (nextTick runs before ALL other async callbacks)`,
    warning: 'process.nextTick() can starve the event loop if called recursively. Use setImmediate() for deferring work to the next iteration.',
  },
  {
    id: 'nd3',
    question: 'CommonJS vs ES Modules in Node.js',
    difficulty: 'basics',
    simple: 'CommonJS (require/module.exports) is the traditional Node.js module system. ES Modules (import/export) is the modern standard. Use "type": "module" in package.json to enable ESM.',
    table: {
      headers: ['Feature', 'CommonJS', 'ES Modules'],
      rows: [
        ['Syntax', 'require() / module.exports', 'import / export'],
        ['Loading', 'Synchronous', 'Asynchronous'],
        ['Top-level await', '❌ Not supported', '✅ Supported'],
        ['Tree shaking', '❌ No', '✅ Yes'],
        ['Default in Node', '✅ Default', 'Needs "type": "module"'],
        ['File extension', '.js or .cjs', '.mjs or .js with type: module'],
      ],
    },
    code: `// CommonJS
const express = require('express');
module.exports = { myFunction };
module.exports = router;

// ES Modules
import express from 'express';
export const myFunction = () => {};
export default router;

// package.json for ESM
{
  "type": "module",
  "main": "index.js"
}

// Dynamic import (works in both)
const module = await import('./myModule.js');`,
  },
  {
    id: 'nd4',
    question: 'Streams in Node.js – Types and use cases',
    difficulty: 'advanced',
    simple: 'Streams are objects that let you read or write data piece-by-piece, rather than loading entire data into memory. This is crucial for handling large files or real-time data.',
    points: [
      { bold: 'Readable', text: 'Source of data (fs.createReadStream, HTTP request)' },
      { bold: 'Writable', text: 'Destination for data (fs.createWriteStream, HTTP response)' },
      { bold: 'Duplex', text: 'Both readable and writable (TCP sockets)' },
      { bold: 'Transform', text: 'Modify data as it passes through (zlib, crypto)' },
    ],
    code: `const fs = require('fs');

// ❌ Bad: loads entire file into memory
const data = fs.readFileSync('huge-file.csv', 'utf-8');

// ✅ Good: stream processes chunk by chunk
const readStream = fs.createReadStream('huge-file.csv');
const writeStream = fs.createWriteStream('output.csv');

readStream.pipe(writeStream); // Handles backpressure automatically

// Transform stream example
const { Transform } = require('stream');
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  }
});

readStream.pipe(upperCase).pipe(writeStream);

// Real use: Streaming large API response
app.get('/download', (req, res) => {
  const stream = fs.createReadStream('large-file.zip');
  stream.pipe(res); // Streams directly to client
});`,
    tip: 'Mention backpressure – when the writable stream can\'t keep up with the readable stream. pipe() handles this automatically, but manual consumption needs .pause() and .resume().',
  },
  {
    id: 'nd5',
    question: 'Cluster Module vs Worker Threads',
    difficulty: 'advanced',
    simple: 'Cluster module creates multiple processes (each with its own event loop) to handle concurrent requests. Worker Threads create threads within a single process for CPU-intensive tasks. Use Cluster for scaling HTTP servers, Worker Threads for heavy computations.',
    table: {
      headers: ['Feature', 'Cluster', 'Worker Threads'],
      rows: [
        ['Type', 'Multiple processes', 'Multiple threads'],
        ['Memory', 'Separate memory per process', 'Shared memory (SharedArrayBuffer)'],
        ['Use case', 'Scaling HTTP servers', 'CPU-intensive computation'],
        ['Communication', 'IPC (Inter-Process Communication)', 'MessagePort / SharedArrayBuffer'],
        ['Overhead', 'Higher (full process)', 'Lower (thread)'],
      ],
    },
    code: `// Cluster module – scale HTTP server across CPU cores
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  console.log(\`Primary \${process.pid} forking \${numCPUs} workers\`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(\`Worker \${worker.process.pid} died, restarting...\`);
    cluster.fork(); // Auto-restart crashed workers
  });
} else {
  const app = require('./app');
  app.listen(3000);
}

// Worker Threads – CPU-heavy task
const { Worker, parentPort } = require('worker_threads');

// main.js
const worker = new Worker('./heavy-task.js', { workerData: bigArray });
worker.on('message', result => console.log(result));

// heavy-task.js
const { workerData, parentPort } = require('worker_threads');
const result = heavyComputation(workerData);
parentPort.postMessage(result);`,
  },
  {
    id: 'nd6',
    question: 'Error handling best practices in Node.js',
    difficulty: 'intermediate',
    simple: 'Always handle errors! Use try/catch for sync/async code, error-first callbacks, EventEmitter error events, and global handlers for uncaught exceptions. Never ignore errors in production.',
    code: `// 1. try/catch with async/await
async function fetchData() {
  try {
    const data = await db.query('SELECT * FROM users');
    return data;
  } catch (err) {
    logger.error('DB query failed:', err);
    throw new AppError('Database error', 500);
  }
}

// 2. Error-first callback pattern
fs.readFile('config.json', (err, data) => {
  if (err) {
    console.error('Failed to read config:', err);
    return;
  }
  // process data
});

// 3. Global error handlers (safety net)
process.on('uncaughtException', (err) => {
  logger.fatal('Uncaught Exception:', err);
  process.exit(1); // Must exit – state is corrupted
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  // Optionally exit
});

// 4. Custom Error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}`,
  },
  {
    id: 'nd7',
    question: 'What is package.json vs package-lock.json?',
    difficulty: 'basics',
    simple: 'package.json defines your project metadata and dependencies with version ranges. package-lock.json locks exact versions of every dependency (including nested ones) to ensure reproducible builds.',
    table: {
      headers: ['Aspect', 'package.json', 'package-lock.json'],
      rows: [
        ['Purpose', 'Project config & dependency ranges', 'Exact locked versions'],
        ['Version format', '^1.2.3 (range)', '1.2.3 (exact)'],
        ['Git commit?', '✅ Yes', '✅ Yes (crucial!)'],
        ['Manual edit?', '✅ Yes', '❌ Never edit manually'],
        ['Created by', 'Developer', 'npm install (auto)'],
      ],
    },
    code: `// package.json – version ranges
{
  "dependencies": {
    "express": "^4.18.0",  // ^  = minor + patch updates allowed
    "mongoose": "~7.0.0",  // ~  = only patch updates
    "cors": "2.8.5"        // exact version only
  },
  "devDependencies": {
    "nodemon": "^3.0.0"    // only for development
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}

// Key commands
// npm install         → uses lock file for exact versions
// npm update          → updates within range, updates lock
// npm ci              → clean install (CI/CD), exact lock versions`,
  },
  {
    id: 'nd8',
    question: 'Buffer and how Node.js handles binary data',
    difficulty: 'intermediate',
    simple: 'Buffer is a fixed-size chunk of memory allocated outside the V8 heap, used to handle binary data directly. Essential for file I/O, network protocols, and image processing.',
    code: `// Creating Buffers
const buf1 = Buffer.from('Hello');
const buf2 = Buffer.alloc(10);       // 10 zero-filled bytes
const buf3 = Buffer.from([72, 101]); // From byte array

// Reading/Writing
console.log(buf1.toString());        // 'Hello'
console.log(buf1.toString('hex'));   // '48656c6c6f'
console.log(buf1.length);           // 5 bytes

// Buffer in real use – file reading
const fs = require('fs');
const data = fs.readFileSync('image.png'); // Returns Buffer
console.log(data instanceof Buffer);       // true

// Converting between encodings
const base64 = buf1.toString('base64');     // 'SGVsbG8='
const back = Buffer.from(base64, 'base64'); // <Buffer 48 65 6c 6c 6f>

// Comparing buffers
Buffer.compare(buf1, buf3); // 0 if equal, -1 or 1 if different`,
  },
  {
    id: 'nd9',
    question: 'Environment variables and configuration management',
    difficulty: 'basics',
    simple: 'Environment variables store sensitive configuration (API keys, DB URLs) outside source code. Use process.env to access them. Use dotenv package for local development, never commit .env files.',
    code: `// .env file (never commit this!)
PORT=3000
MONGODB_URI=mongodb://localhost/myapp
JWT_SECRET=super-secret-key-here
NODE_ENV=development

// Access in code
require('dotenv').config();

const port = process.env.PORT || 3000;
const dbUri = process.env.MONGODB_URI;
const isProduction = process.env.NODE_ENV === 'production';

// config.js – centralized configuration
module.exports = {
  port: process.env.PORT || 3000,
  db: {
    uri: process.env.MONGODB_URI,
    options: { useNewUrlParser: true }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  }
};

// .gitignore
// .env
// .env.local
// .env.production`,
    warning: 'Never hardcode secrets in source code. Never commit .env files. Use environment variables in CI/CD and cloud platforms.',
  },
  {
    id: 'nd10',
    question: 'How to diagnose memory leaks in Node.js?',
    difficulty: 'expert',
    simple: 'Memory leaks occur when allocated memory isn\'t released. Common causes: global variables, closures retaining references, unclosed event listeners, caching without limits. Use heap snapshots and --inspect flag to diagnose.',
    points: [
      { bold: 'Heap snapshots', text: 'Take snapshots via Chrome DevTools with --inspect flag' },
      { bold: 'process.memoryUsage()', text: 'Monitor RSS, heapUsed, heapTotal programmatically' },
      { bold: 'clinic.js', text: 'Automated profiling tool for Node.js' },
      { bold: 'Common causes', text: 'Global caches, event listeners not removed, closures, circular references' },
    ],
    code: `// Monitor memory usage
setInterval(() => {
  const { rss, heapUsed, heapTotal } = process.memoryUsage();
  console.log(\`RSS: \${(rss / 1024 / 1024).toFixed(2)} MB\`);
  console.log(\`Heap: \${(heapUsed / 1024 / 1024).toFixed(2)} / \${(heapTotal / 1024 / 1024).toFixed(2)} MB\`);
}, 10000);

// Common leak: event listener not cleaned up
class UserService {
  constructor() {
    // ❌ Leak: listener added every time, never removed
    eventBus.on('userUpdate', this.handleUpdate);
  }
  
  // ✅ Fix: cleanup on destroy
  destroy() {
    eventBus.off('userUpdate', this.handleUpdate);
  }
}

// Common leak: unbounded cache
const cache = new Map();
// ❌ cache.set(key, data); // Never expires!

// ✅ Use LRU cache with size limit
const LRU = require('lru-cache');
const cache = new LRU({ max: 500, ttl: 1000 * 60 * 5 });`,
  },
  {
    id: 'nd11',
    question: 'Middleware pattern in Node.js',
    difficulty: 'intermediate',
    simple: 'Middleware is a function that has access to the request, response, and next function in the application\'s request-response cycle. It can execute code, modify req/res, end the cycle, or call next().',
    code: `// Middleware function signature
function logger(req, res, next) {
  console.log(\`\${req.method} \${req.url} - \${new Date().toISOString()}\`);
  next(); // Pass control to next middleware
}

// Error handling middleware (4 params)
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    error: err.message || 'Internal Server Error'
  });
}

// Auth middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Usage order matters!
app.use(logger);           // Runs on ALL requests
app.use('/api', authenticate); // Only /api routes
app.use(errorHandler);     // Must be LAST`,
  },
  {
    id: 'nd12',
    question: 'What is PM2 and how to deploy Node.js in production?',
    difficulty: 'intermediate',
    simple: 'PM2 is a production-grade process manager for Node.js. It provides clustering, auto-restart, log management, and monitoring. Essential for production deployments.',
    code: `// Install PM2 globally
// npm install -g pm2

// Start application
// pm2 start server.js --name "my-api" -i max
// -i max = cluster mode with all CPU cores

// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-api',
    script: './server.js',
    instances: 'max',          // Use all CPU cores
    exec_mode: 'cluster',      // Cluster mode
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    max_memory_restart: '1G',  // Restart if > 1GB RAM
    error_file: './logs/error.log',
    out_file: './logs/output.log'
  }]
};

// Common PM2 commands:
// pm2 list          → show all processes
// pm2 logs          → real-time logs
// pm2 restart all   → restart all processes
// pm2 reload all    → zero-downtime reload
// pm2 monit         → dashboard monitor`,
  },
  {
    id: 'nd13',
    question: 'What is libuv and how does Node.js handle I/O?',
    difficulty: 'expert',
    simple: 'libuv is a C library that provides Node.js with its event loop and asynchronous I/O operations. It uses a thread pool (default 4 threads) for operations that can\'t be done asynchronously at the OS level.',
    points: [
      { bold: 'OS-level async', text: 'Network I/O, DNS resolution (epoll/kqueue/IOCP)' },
      { bold: 'Thread pool', text: 'File system, DNS lookup, compression (default 4 threads)' },
      { bold: 'UV_THREADPOOL_SIZE', text: 'Environment variable to increase thread pool (max 1024)' },
      { bold: 'Event demultiplexer', text: 'OS mechanism that monitors multiple I/O sources' },
    ],
    code: `// libuv thread pool handles these operations:
// - fs.readFile, fs.writeFile
// - dns.lookup (not dns.resolve)
// - crypto.pbkdf2, crypto.randomBytes
// - zlib compression

// Demonstrate thread pool limit
const crypto = require('crypto');

// Default 4 threads – first 4 run in parallel, 5th waits
for (let i = 0; i < 5; i++) {
  const start = Date.now();
  crypto.pbkdf2('password', 'salt', 100000, 64, 'sha512', () => {
    console.log(\`Hash \${i}: \${Date.now() - start}ms\`);
  });
}

// Increase thread pool
// UV_THREADPOOL_SIZE=8 node server.js
process.env.UV_THREADPOOL_SIZE = 8;`,
  },
  {
    id: 'nd14',
    question: 'EventEmitter pattern in Node.js',
    difficulty: 'intermediate',
    simple: 'EventEmitter is the core pattern in Node.js for handling events. Many built-in modules (http, fs, streams) extend EventEmitter. You can create custom event-driven architectures with it.',
    code: `const EventEmitter = require('events');

// Custom event emitter
class OrderService extends EventEmitter {
  placeOrder(order) {
    // Process order...
    this.emit('orderPlaced', order);
  }
}

const orderService = new OrderService();

// Register listeners
orderService.on('orderPlaced', (order) => {
  console.log('Send confirmation email for:', order.id);
});

orderService.on('orderPlaced', (order) => {
  console.log('Update inventory for:', order.id);
});

// Once – listener fires only once
orderService.once('orderPlaced', (order) => {
  console.log('Welcome bonus for first order!');
});

orderService.placeOrder({ id: 1, item: 'Laptop' });

// Error handling
orderService.on('error', (err) => {
  console.error('Order error:', err);
});

// Max listeners (default 10, warning if exceeded)
orderService.setMaxListeners(20);`,
  },
  {
    id: 'nd15',
    question: 'Graceful shutdown in Node.js applications',
    difficulty: 'advanced',
    simple: 'Graceful shutdown means closing your app properly – finishing active requests, closing DB connections, and flushing logs before the process exits. Essential for zero-downtime deployments.',
    code: `const server = app.listen(3000);

// Graceful shutdown handler
function gracefulShutdown(signal) {
  console.log(\`\${signal} received. Starting graceful shutdown...\`);
  
  // 1. Stop accepting new connections
  server.close(() => {
    console.log('HTTP server closed');
    
    // 2. Close database connections
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      
      // 3. Close Redis, message queues, etc.
      redisClient.quit(() => {
        console.log('Redis connection closed');
        process.exit(0);
      });
    });
  });
  
  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
}

// Listen for termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));`,
  },
];

export default nodejs;
