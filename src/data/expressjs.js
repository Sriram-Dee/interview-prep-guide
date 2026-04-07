const expressjs = [
  {
    id: 'ex1',
    question: 'What is Express.js and why use it?',
    difficulty: 'basics',
    simple: 'Express.js is a minimal, flexible Node.js web framework that provides a robust set of features for building web and mobile APIs. It simplifies routing, middleware, and HTTP handling.',
    points: [
      { bold: 'Minimal & unopinionated', text: 'Gives you structure without forcing patterns' },
      { bold: 'Middleware-based', text: 'Plug-in architecture for request processing' },
      { bold: 'Routing', text: 'Powerful URL routing with params, query strings, and methods' },
      { bold: 'Template engines', text: 'Supports EJS, Pug, Handlebars for server-side rendering' },
      { bold: 'Huge ecosystem', text: 'Thousands of middleware packages available' },
    ],
    code: `const express = require('express');
const app = express();

// Built-in middleware
app.use(express.json());         // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static('public')); // Serve static files

// Basic route
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
  },
  {
    id: 'ex2',
    question: 'Explain Express.js middleware in detail',
    difficulty: 'intermediate',
    simple: 'Middleware functions are functions that have access to req, res, and next. They execute sequentially in the order they are defined. They can modify request/response, end the cycle, or pass control to the next middleware.',
    points: [
      { bold: 'Application-level', text: 'app.use() – runs on every request' },
      { bold: 'Router-level', text: 'router.use() – scoped to specific router' },
      { bold: 'Error-handling', text: '4 parameters: (err, req, res, next)' },
      { bold: 'Built-in', text: 'express.json(), express.static(), express.urlencoded()' },
      { bold: 'Third-party', text: 'cors, helmet, morgan, compression' },
    ],
    code: `// Custom logging middleware
const logger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`\${req.method} \${req.url} \${res.statusCode} - \${duration}ms\`);
  });
  next();
};

// Middleware factory (configurable)
const rateLimit = (maxRequests, windowMs) => {
  const requests = new Map();
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const userRequests = requests.get(ip) || [];
    const recent = userRequests.filter(t => now - t < windowMs);
    
    if (recent.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    recent.push(now);
    requests.set(ip, recent);
    next();
  };
};

// Order matters!
app.use(logger);                        // 1st - log everything
app.use(express.json());                // 2nd - parse body
app.use('/api', rateLimit(100, 60000)); // 3rd - rate limit API
app.use('/api', authMiddleware);        // 4th - authenticate
// Routes defined after middleware
app.use('/api/users', userRoutes);`,
  },
  {
    id: 'ex3',
    question: 'How do you structure an Express.js project (MVC)?',
    difficulty: 'intermediate',
    simple: 'Use MVC (Model-View-Controller) or a feature-based structure. Separate concerns: routes, controllers, models, middleware, and config into dedicated folders.',
    code: `// Project structure (MVC)
// src/
// ├── config/         → db.js, env.js
// ├── controllers/    → userController.js
// ├── middleware/     → auth.js, errorHandler.js
// ├── models/         → User.js
// ├── routes/         → userRoutes.js
// ├── services/       → userService.js (business logic)
// ├── utils/          → helpers.js, AppError.js
// ├── validators/     → userValidator.js
// └── app.js          → Express app setup

// routes/userRoutes.js
const router = express.Router();
const { getUsers, createUser } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { validateUser } = require('../validators/userValidator');

router.get('/', authenticate, getUsers);
router.post('/', authenticate, validateUser, createUser);

module.exports = router;

// controllers/userController.js
const UserService = require('../services/userService');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await UserService.findAll(req.query);
    res.json({ success: true, data: users });
  } catch (err) {
    next(err); // Pass to error handler
  }
};`,
    tip: 'In interviews, mention the service layer pattern – controllers handle HTTP, services handle business logic. This makes code testable and reusable.',
  },
  {
    id: 'ex4',
    question: 'RESTful API design best practices',
    difficulty: 'intermediate',
    simple: 'REST uses HTTP methods (GET, POST, PUT, PATCH, DELETE) with noun-based URLs. Use proper status codes, consistent response format, pagination, and versioning.',
    table: {
      headers: ['Method', 'URL', 'Action', 'Status Code'],
      rows: [
        ['GET', '/api/users', 'List all users', '200'],
        ['GET', '/api/users/:id', 'Get one user', '200 / 404'],
        ['POST', '/api/users', 'Create user', '201'],
        ['PUT', '/api/users/:id', 'Replace user', '200'],
        ['PATCH', '/api/users/:id', 'Update fields', '200'],
        ['DELETE', '/api/users/:id', 'Delete user', '204'],
      ],
    },
    code: `// Consistent response format
const sendResponse = (res, statusCode, data, message = 'Success') => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

// Pagination
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit),
    User.countDocuments()
  ]);
  
  res.json({
    data: users,
    pagination: {
      page, limit, total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total
    }
  });
});

// API versioning
app.use('/api/v1/users', userRoutesV1);
app.use('/api/v2/users', userRoutesV2);`,
  },
  {
    id: 'ex5',
    question: 'Error handling middleware in Express',
    difficulty: 'intermediate',
    simple: 'Express error handlers have 4 parameters (err, req, res, next). Define them AFTER all routes. Differentiate between operational errors (expected) and programming errors (bugs).',
    code: `// Custom Error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = \`\${statusCode}\`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper (avoids try/catch in every route)
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// Usage
app.get('/api/users/:id', catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json(user);
}));

// Global error handler (MUST be last middleware)
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      error: err.message,
      stack: err.stack
    });
  } else {
    // Production: don't leak error details
    res.status(err.statusCode).json({
      error: err.isOperational ? err.message : 'Something went wrong'
    });
  }
});`,
    tip: 'The catchAsync wrapper pattern is asked frequently. It eliminates repetitive try/catch blocks in every route handler.',
  },
  {
    id: 'ex6',
    question: 'Authentication with JWT in Express',
    difficulty: 'advanced',
    simple: 'JWT (JSON Web Token) is a stateless authentication mechanism. Server creates a token on login, client sends it in Authorization header. Server verifies the token on each request. Use httpOnly cookies for security.',
    code: `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // 1. Find user
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  // 2. Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  
  // 3. Generate JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // 4. Send as httpOnly cookie (more secure than localStorage!)
  res.cookie('jwt', token, {
    httpOnly: true,     // Can't access via JavaScript
    secure: true,       // HTTPS only
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  
  res.json({ success: true, user: { id: user._id, name: user.name } });
});

// Auth middleware
const protect = async (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Role-based authorization
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Not authorized' });
  }
  next();
};

// Protected route
app.delete('/api/users/:id', protect, authorize('admin'), deleteUser);`,
  },
  {
    id: 'ex7',
    question: 'CORS – What is it and how to handle it?',
    difficulty: 'intermediate',
    simple: 'CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks requests from different origins. Configure it on the server to allow specific origins, methods, and headers.',
    code: `const cors = require('cors');

// Allow all origins (development only!)
app.use(cors());

// Production CORS configuration
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,    // Allow cookies
  maxAge: 86400         // Cache preflight for 24h
}));

// Dynamic origin (from database/config)
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Preflight request: browser sends OPTIONS before actual request
// cors() middleware handles this automatically`,
    warning: 'Never use cors() with no options in production. Always whitelist specific origins.',
  },
  {
    id: 'ex8',
    question: 'Request validation with Joi or Zod',
    difficulty: 'intermediate',
    simple: 'Always validate incoming request data! Use schema-based validation libraries like Joi or Zod. They validate types, formats, required fields, and return clear error messages.',
    code: `// Using Joi
const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(18).max(100),
  role: Joi.string().valid('user', 'admin').default('user')
});

// Validation middleware factory
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,    // Return all errors, not just first
    stripUnknown: true    // Remove unknown fields
  });
  
  if (error) {
    const errors = error.details.map(d => d.message);
    return res.status(400).json({ errors });
  }
  
  req.body = value; // Use validated/sanitized data
  next();
};

// Usage
app.post('/api/users', validate(userSchema), createUser);

// Using Zod (TypeScript-first)
const { z } = require('zod');
const UserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().min(18).optional()
});`,
  },
  {
    id: 'ex9',
    question: 'Express.js security best practices',
    difficulty: 'advanced',
    simple: 'Secure your Express app with Helmet (security headers), rate limiting, input sanitization, HTTPS, CORS, and parameterized queries. Defense in depth – use multiple layers.',
    code: `const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// 1. Set security HTTP headers
app.use(helmet());

// 2. Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // 100 requests per window
  message: 'Too many requests, please try again later'
});
app.use('/api', limiter);

// 3. Body size limit (prevent large payload attacks)
app.use(express.json({ limit: '10kb' }));

// 4. Data sanitization against NoSQL injection
app.use(mongoSanitize()); // Removes $ and . from req.body

// 5. Prevent HTTP parameter pollution
app.use(hpp({ whitelist: ['sort', 'filter'] }));

// 6. Prevent XSS (sanitize user input)
const xss = require('xss-clean');
app.use(xss());

// 7. HTTPS redirect in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(\`https://\${req.header('host')}\${req.url}\`);
    }
    next();
  });
}`,
    tip: 'Always mention at least 3-4 security measures when asked. Helmet + rate limiting + sanitization + CORS is the minimum.',
  },
  {
    id: 'ex10',
    question: 'Path params vs Query params vs Body – When to use what?',
    difficulty: 'basics',
    simple: 'Path params (/users/:id) identify a resource. Query params (?page=1&sort=name) filter/sort/paginate. Request body sends data for creation/updates. Each has a specific purpose.',
    table: {
      headers: ['Type', 'Syntax', 'Use Case', 'Example'],
      rows: [
        ['Path params', '/users/:id', 'Identify specific resource', 'GET /users/123'],
        ['Query params', '?key=value', 'Filter, sort, paginate', 'GET /users?role=admin&page=2'],
        ['Body', 'req.body', 'Send data (POST/PUT/PATCH)', 'POST /users { name: "Sriram" }'],
        ['Headers', 'req.headers', 'Auth tokens, content type', 'Authorization: Bearer token'],
      ],
    },
    code: `// Path params – req.params
app.get('/api/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  // userId = "123", postId = "456"
});

// Query params – req.query
app.get('/api/products', (req, res) => {
  const { page = 1, limit = 10, sort = 'price', category } = req.query;
  // /api/products?page=2&limit=20&sort=price&category=electronics
});

// Body – req.body (needs express.json())
app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;
});

// All three in one request
app.put('/api/orgs/:orgId/members/:userId', (req, res) => {
  const { orgId, userId } = req.params;   // Who
  const { role } = req.body;              // What to update
  const { notify } = req.query;           // Options
});`,
  },
  {
    id: 'ex11',
    question: 'How to implement file uploads in Express?',
    difficulty: 'intermediate',
    simple: 'Use multer middleware for handling multipart/form-data (file uploads). Configure storage, file size limits, and file type validation. Store files on disk or cloud (S3, Cloudinary).',
    code: `const multer = require('multer');
const path = require('path');

// Disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = \`\${Date.now()}-\${Math.round(Math.random() * 1E9)}\`;
    cb(null, \`\${uniqueName}\${path.extname(file.originalname)}\`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Routes
app.post('/api/upload', upload.single('avatar'), (req, res) => {
  res.json({ file: req.file }); // Single file
});

app.post('/api/gallery', upload.array('photos', 10), (req, res) => {
  res.json({ files: req.files }); // Multiple files (max 10)
});`,
  },
  {
    id: 'ex12',
    question: 'Express Router – Modular routing',
    difficulty: 'basics',
    simple: 'Express Router creates modular, mountable route handlers. It\'s like a mini Express app that handles only routes. Use it to split routes into separate files organized by resource.',
    code: `// routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Middleware specific to this router
router.use(authenticate);

router.route('/')
  .get(getAllUsers)    // GET /api/users
  .post(createUser);   // POST /api/users

router.route('/:id')
  .get(getUser)        // GET /api/users/:id
  .put(updateUser)     // PUT /api/users/:id
  .delete(deleteUser); // DELETE /api/users/:id

// Nested routes
router.use('/:userId/posts', postRoutes);

module.exports = router;

// app.js – mount routers
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Route parameters middleware
router.param('id', async (req, res, next, id) => {
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  req.userDoc = user;
  next();
});`,
  },
  {
    id: 'ex13',
    question: 'Difference between app.use() and app.all() and app.get()',
    difficulty: 'intermediate',
    simple: 'app.use() mounts middleware for any HTTP method and matches path prefixes. app.all() matches all HTTP methods for an exact path. app.get() matches only GET requests for an exact path.',
    table: {
      headers: ['Method', 'HTTP Methods', 'Path Matching', 'Use Case'],
      rows: [
        ['app.use()', 'ALL', 'Prefix match (/api matches /api/users)', 'Middleware'],
        ['app.all()', 'ALL', 'Exact match', 'Common handler for all methods'],
        ['app.get()', 'GET only', 'Exact match', 'Specific route handler'],
      ],
    },
    code: `// app.use – prefix matching + all methods
app.use('/api', (req, res, next) => {
  // Runs for /api, /api/users, /api/users/123, etc.
  next();
});

// app.all – exact path + all methods
app.all('/api/data', (req, res) => {
  // Runs for GET/POST/PUT/DELETE /api/data (but NOT /api/data/1)
  res.json({ method: req.method });
});

// app.get – exact path + GET only
app.get('/api/users', (req, res) => {
  // Runs ONLY for GET /api/users
});

// Common pattern: 404 handler for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({ error: \`Cannot \${req.method} \${req.url}\` });
});`,
  },
  {
    id: 'ex14',
    question: 'How to implement caching in Express APIs?',
    difficulty: 'advanced',
    simple: 'Use Redis for server-side caching, HTTP cache headers for client-side caching, and in-memory caching (node-cache) for simple cases. Caching dramatically improves API performance.',
    code: `const redis = require('redis');
const client = redis.createClient();

// Redis caching middleware
const cache = (duration) => async (req, res, next) => {
  const key = \`cache:\${req.originalUrl}\`;
  
  try {
    const cached = await client.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Override res.json to cache the response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      client.setEx(key, duration, JSON.stringify(data));
      return originalJson(data);
    };
    
    next();
  } catch (err) {
    next(); // If Redis fails, continue without cache
  }
};

// Usage – cache for 5 minutes
app.get('/api/products', cache(300), async (req, res) => {
  const products = await Product.find(); // Only runs on cache miss
  res.json(products);
});

// Cache invalidation on write
app.post('/api/products', async (req, res) => {
  await Product.create(req.body);
  await client.del('cache:/api/products'); // Invalidate cache
  res.status(201).json({ success: true });
});

// HTTP cache headers (client-side)
app.get('/api/config', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600'); // 1 hour
  res.json(config);
});`,
  },
  {
    id: 'ex15',
    question: 'Express.js vs Fastify vs Koa – When to choose what?',
    difficulty: 'advanced',
    simple: 'Express is the most popular and mature. Fastify is faster with built-in validation. Koa is lightweight with modern async/await. Choose Express for ecosystem, Fastify for performance, Koa for simplicity.',
    table: {
      headers: ['Framework', 'Best For', 'Performance', 'Key Feature'],
      rows: [
        ['Express', 'General purpose, legacy', 'Good', 'Largest middleware ecosystem'],
        ['Fastify', 'High-performance APIs', 'Best (2x Express)', 'Built-in schema validation, logging'],
        ['Koa', 'Modern, minimalist', 'Good', 'async/await native, tiny core'],
        ['NestJS', 'Enterprise apps', 'Good', 'TypeScript, Angular-inspired DI'],
        ['Hono', 'Edge/serverless', 'Excellent', 'Ultra-lightweight, multi-runtime'],
      ],
    },
    code: `// Express (familiar)
app.get('/api/users', async (req, res) => {
  const users = await getUsers();
  res.json(users);
});

// Fastify (schema-based validation built-in)
fastify.get('/api/users', {
  schema: {
    response: {
      200: {
        type: 'array',
        items: { type: 'object', properties: { name: { type: 'string' } } }
      }
    }
  }
}, async (request, reply) => {
  return getUsers();
});

// Koa (ctx-based, no callback)
router.get('/api/users', async (ctx) => {
  ctx.body = await getUsers();
});`,
    tip: 'In Chennai interviews, Express is still the most asked. But mentioning Fastify/NestJS knowledge shows you stay updated with the ecosystem.',
  },
  {
    id: 'ex16',
    question: 'How do you pass data between middlewares in Express.js?',
    difficulty: 'intermediate',
    simple: 'You can pass data between middlewares by attaching properties to the Request (req) or Response (res.locals) objects before calling next().',
    points: [
      { bold: 'Extending req object', text: 'Commonly used to store authenticated user data (e.g., req.user = user).' },
      { bold: 'Using res.locals', text: 'An object scoped to the request cycle. Perfect for passing data specifically for view rendering or scoped operations without polluting the request.' }
    ],
    code: `// Middleware 1: Authentication
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send('Unauthorized');
  
  // Attach user to the request object
  req.user = { id: 1, role: 'admin' };
  
  // Attach data to res.locals
  res.locals.startTime = Date.now();
  
  next(); // Pass control to next middleware
};

// Middleware 2 / Route handler
app.get('/dashboard', authenticate, (req, res) => {
  // Access data passed from previous middleware
  console.log('User Role:', req.user.role); 
  console.log('Start Time:', res.locals.startTime);
  
  res.send(\`Welcome \${req.user.role}\`);
});`
  },
  {
    id: 'ex17',
    question: 'What happens if you forget to call next() in a middleware?',
    difficulty: 'basics',
    simple: 'If you fail to call next() (and do not send a response), the request will hang indefinitely. The client will eventually receive a timeout error because the Express request-response cycle is left incomplete.',
    points: [
      { bold: 'Call next()', text: 'To pass control to the next middleware or route handler in the stack.' },
      { bold: 'End the cycle', text: 'Use res.send(), res.json(), res.end(), or similar to finish the request. If you do this, you don\'t need next().' },
      { bold: 'Error handling', text: 'Call next(err) to skip all remaining normal middlewares and jump straight to the error-handling middleware.' }
    ]
  }
];

export default expressjs;
