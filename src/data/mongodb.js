const mongodb = [
  {
    id: 'mg1',
    question: 'What is MongoDB and how is it different from SQL databases?',
    difficulty: 'basics',
    simple: 'MongoDB is a document-based NoSQL database that stores data in flexible JSON-like documents (BSON). Unlike SQL databases with rigid schemas and tables, MongoDB allows dynamic schemas and nested data structures.',
    table: {
      headers: ['Aspect', 'MongoDB (NoSQL)', 'SQL (MySQL/PostgreSQL)'],
      rows: [
        ['Data model', 'Documents (JSON/BSON)', 'Tables & Rows'],
        ['Schema', 'Flexible / dynamic', 'Fixed / rigid'],
        ['Relationships', 'Embedding or referencing', 'JOINs with foreign keys'],
        ['Scaling', 'Horizontal (sharding)', 'Vertical (bigger server)'],
        ['Query language', 'MongoDB Query (MQL)', 'SQL'],
        ['Best for', 'Rapid development, flexible data', 'Complex relationships, ACID'],
      ],
    },
    code: `// SQL table row
// | id | name   | email          | age |
// | 1  | Sriram | sri@mail.com   | 25  |

// MongoDB document
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "name": "Sriram",
  "email": "sri@mail.com",
  "age": 25,
  "address": {           // Nested object (no JOIN needed!)
    "city": "Chennai",
    "state": "Tamil Nadu"
  },
  "skills": ["React", "Node.js", "MongoDB"] // Arrays supported
}`,
  },
  {
    id: 'mg2',
    question: 'CRUD operations in MongoDB with Mongoose',
    difficulty: 'basics',
    simple: 'CRUD = Create, Read, Update, Delete. Mongoose is an ODM (Object Data Modeling) library that provides schema validation and methods for MongoDB operations in Node.js.',
    code: `const mongoose = require('mongoose');

// Define Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  age: { type: Number, min: 18 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// CREATE
const user = await User.create({ name: 'Sriram', email: 'sri@mail.com' });

// READ
const allUsers = await User.find();
const admins = await User.find({ role: 'admin' });
const oneUser = await User.findById(id);
const userByEmail = await User.findOne({ email: 'sri@mail.com' });

// UPDATE
await User.findByIdAndUpdate(id, { name: 'Ram' }, { new: true, runValidators: true });
await User.updateMany({ role: 'user' }, { $set: { isActive: true } });

// DELETE
await User.findByIdAndDelete(id);
await User.deleteMany({ isActive: false });

// Query methods
const results = await User.find({ age: { $gte: 18 } })
  .select('name email')     // Only these fields
  .sort({ createdAt: -1 })  // Newest first
  .limit(10)                 // Pagination
  .skip(20)                  // Offset
  .lean();                   // Return plain JS objects (faster)`,
  },
  {
    id: 'mg3',
    question: 'Embedding vs Referencing – Schema design strategies',
    difficulty: 'intermediate',
    simple: 'Embedding stores related data inside the document (denormalized). Referencing stores the ObjectId and uses populate() to fetch related data (normalized). Choose based on data access patterns.',
    table: {
      headers: ['Strategy', 'When to Use', 'Pros', 'Cons'],
      rows: [
        ['Embedding', 'Data read together, 1:few', 'Single query, fast reads', 'Document size limit (16MB), data duplication'],
        ['Referencing', 'Many:many, independent entities', 'No duplication, flexible', 'Multiple queries (populate), slower'],
      ],
    },
    code: `// EMBEDDING – address inside user (1:1 or 1:few)
const userSchema = new Schema({
  name: String,
  address: {              // Embedded subdocument
    street: String,
    city: String,
    state: String
  },
  orders: [{              // Embedded array (1:few)
    item: String,
    price: Number,
    date: Date
  }]
});
// ✅ One query gets everything: User.findById(id)

// REFERENCING – posts reference user (1:many)
const postSchema = new Schema({
  title: String,
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' } // Reference
});

// Populate (like SQL JOIN)
const post = await Post.findById(id).populate('author', 'name email');
// { title: '...', author: { name: 'Sriram', email: '...' } }

// Virtual populate (User → Posts without storing post IDs)
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'author'
});`,
    tip: 'Rule of thumb: If you always need the data together, embed it. If data is accessed independently or is very large, reference it.',
  },
  {
    id: 'mg4',
    question: 'MongoDB Aggregation Pipeline',
    difficulty: 'advanced',
    simple: 'The Aggregation Pipeline processes documents through sequential stages. Each stage transforms the data: $match (filter), $group (aggregate), $sort, $project (select fields), $lookup (join). It\'s like SQL GROUP BY on steroids.',
    code: `// Get total orders and average amount per city
const results = await Order.aggregate([
  // Stage 1: Filter orders from this year
  { $match: { 
    createdAt: { $gte: new Date('2025-01-01') },
    status: 'completed'
  }},
  
  // Stage 2: Group by city
  { $group: {
    _id: '$shippingAddress.city',
    totalOrders: { $sum: 1 },
    totalRevenue: { $sum: '$amount' },
    avgOrder: { $avg: '$amount' },
    maxOrder: { $max: '$amount' }
  }},
  
  // Stage 3: Sort by revenue (highest first)
  { $sort: { totalRevenue: -1 } },
  
  // Stage 4: Rename fields
  { $project: {
    city: '$_id',
    totalOrders: 1,
    totalRevenue: { $round: ['$totalRevenue', 2] },
    avgOrder: { $round: ['$avgOrder', 2] },
    _id: 0
  }},
  
  // Stage 5: Top 10 cities
  { $limit: 10 }
]);

// $lookup – join collections (like SQL JOIN)
const usersWithPosts = await User.aggregate([
  { $lookup: {
    from: 'posts',           // Collection to join
    localField: '_id',       // Field from User
    foreignField: 'author',  // Field from Post
    as: 'userPosts'          // Output array field
  }},
  { $addFields: { postCount: { $size: '$userPosts' } } }
]);`,
    warning: 'Put $match and $sort as early as possible in the pipeline – they can use indexes. Later stages can\'t.',
  },
  {
    id: 'mg5',
    question: 'Indexing in MongoDB – Performance optimization',
    difficulty: 'advanced',
    simple: 'Indexes are data structures that make queries faster by avoiding full collection scans. Like a book index, they point to document locations. Without indexes, MongoDB scans every document.',
    points: [
      { bold: 'Single field', text: 'db.users.createIndex({ email: 1 })' },
      { bold: 'Compound index', text: 'db.orders.createIndex({ status: 1, createdAt: -1 })' },
      { bold: 'Text index', text: 'For full-text search: db.posts.createIndex({ title: "text" })' },
      { bold: 'TTL index', text: 'Auto-delete old documents: { createdAt: 1 }, { expireAfterSeconds: 86400 }' },
      { bold: 'Unique index', text: '{ email: 1 }, { unique: true } – prevents duplicates' },
    ],
    code: `// Create indexes in Mongoose schema
const userSchema = new Schema({
  email: { type: String, unique: true, index: true },
  name: String,
  role: String,
  createdAt: Date
});

// Compound index (ESR rule: Equality, Sort, Range)
userSchema.index({ role: 1, createdAt: -1 });

// Text index for search
userSchema.index({ name: 'text', email: 'text' });

// Check if query uses index
const explained = await User.find({ role: 'admin' })
  .sort({ createdAt: -1 })
  .explain('executionStats');

console.log(explained.executionStats.totalDocsExamined); // Should be low
console.log(explained.executionStats.executionStages.stage); // 'IXSCAN' = good!
// 'COLLSCAN' = bad! (full collection scan, needs index)

// Covered query – index has ALL needed fields
// The query never touches documents, only the index!
await User.find({ email: 'sri@mail.com' })
  .select('email name -_id'); // All fields in the index`,
    tip: 'ESR Rule for compound indexes: fields used in Equality first, then Sort, then Range. This maximizes index efficiency.',
  },
  {
    id: 'mg6',
    question: 'Mongoose middleware (hooks) – pre and post',
    difficulty: 'intermediate',
    simple: 'Mongoose middleware are functions that execute before (pre) or after (post) certain operations like save, validate, remove, or find. Use them for password hashing, logging, data transformation.',
    code: `const bcrypt = require('bcrypt');

// Pre-save hook – hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Pre-find hook – exclude inactive users
userSchema.pre(/^find/, function(next) {
  this.where({ isActive: { $ne: false } });
  next();
});

// Post-save hook – send welcome email
userSchema.post('save', function(doc) {
  if (doc.isNew) {
    sendWelcomeEmail(doc.email, doc.name);
  }
});

// Pre-remove hook – cascade delete
userSchema.pre('deleteOne', { document: true }, async function(next) {
  await Post.deleteMany({ author: this._id });
  await Comment.deleteMany({ user: this._id });
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static methods
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};`,
  },
  {
    id: 'mg7',
    question: 'MongoDB Transactions – ACID in NoSQL',
    difficulty: 'advanced',
    simple: 'MongoDB supports multi-document ACID transactions (since v4.0). Use transactions when you need to update multiple documents atomically – either all succeed or all rollback. Requires a replica set.',
    code: `const session = await mongoose.startSession();

try {
  session.startTransaction();
  
  // Transfer money between accounts (must be atomic!)
  await Account.findByIdAndUpdate(
    senderId,
    { $inc: { balance: -amount } },
    { session }
  );
  
  await Account.findByIdAndUpdate(
    receiverId,
    { $inc: { balance: amount } },
    { session }
  );
  
  // Create transaction record
  await Transaction.create([{
    from: senderId,
    to: receiverId,
    amount,
    timestamp: new Date()
  }], { session });
  
  // If all operations succeed, commit
  await session.commitTransaction();
  
} catch (error) {
  // If any operation fails, rollback everything
  await session.abortTransaction();
  throw error;
  
} finally {
  session.endSession();
}

// Note: Transactions require replica set
// For development, use: mongod --replSet rs0`,
    warning: 'Transactions have performance overhead. Design your schema to minimize their need. Embedding related data often eliminates the need for transactions.',
  },
  {
    id: 'mg8',
    question: 'MongoDB connection best practices with Mongoose',
    difficulty: 'intermediate',
    simple: 'Connect once at app startup, not per request. Use connection pooling, handle connection events, and implement retry logic. Never expose connection strings in code.',
    code: `const mongoose = require('mongoose');

// Connection function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,          // Connection pool
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};

// Connection events
mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('error', (err) => console.error('Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// server.js
const app = require('./app');
connectDB().then(() => {
  app.listen(process.env.PORT || 3000);
});`,
  },
  {
    id: 'mg9',
    question: 'How does MongoDB handle data at scale? Sharding & Replication',
    difficulty: 'expert',
    simple: 'Replication creates copies of data across servers for high availability (replica sets). Sharding distributes data across multiple servers for horizontal scaling. Use replication for reliability, sharding for massive datasets.',
    table: {
      headers: ['Feature', 'Replication', 'Sharding'],
      rows: [
        ['Purpose', 'High availability & redundancy', 'Horizontal scaling'],
        ['How', 'Copy entire data to secondaries', 'Split data across shards'],
        ['Reads', 'Can read from secondaries', 'Routed to correct shard'],
        ['Writes', 'Only to primary', 'Routed by shard key'],
        ['When needed', 'Always (production)', 'Very large datasets (100GB+)'],
      ],
    },
    code: `// Replica Set (3 nodes minimum)
// Primary ← writes
// Secondary ← reads (optional), becomes primary on failure
// Secondary/Arbiter ← voting

// Read preference options
const users = await User.find()
  .read('secondaryPreferred'); // Read from secondary if available

// Shard key selection (critical!)
// Good shard key: high cardinality, good distribution
sh.shardCollection('mydb.orders', { customerId: 'hashed' });

// Bad shard key: low cardinality
// sh.shardCollection('mydb.orders', { status: 1 }); // ❌ Only 3-4 values!

// Connection string for replica set
// mongodb://host1:27017,host2:27017,host3:27017/mydb?replicaSet=rs0`,
    tip: 'Most Chennai-based companies use MongoDB Atlas (managed service). You don\'t set up sharding manually, but understanding the concept is important for interviews.',
  },
  {
    id: 'mg10',
    question: 'MongoDB Query Operators – Most commonly used',
    difficulty: 'basics',
    simple: 'MongoDB provides comparison ($gt, $lt, $in), logical ($and, $or), element ($exists), and array ($elemMatch, $push, $pull) operators. Know these for building complex queries.',
    code: `// Comparison operators
await User.find({ age: { $gte: 18, $lte: 65 } });   // 18-65
await User.find({ role: { $in: ['admin', 'mod'] } }); // admin OR mod
await User.find({ role: { $ne: 'banned' } });         // NOT banned

// Logical operators
await User.find({
  $or: [
    { email: 'sri@mail.com' },
    { name: 'Sriram' }
  ]
});

await User.find({
  $and: [
    { age: { $gte: 18 } },
    { isActive: true }
  ]
});

// Array operators
await User.find({ skills: { $all: ['React', 'Node'] } }); // Has ALL
await User.find({ 'skills.0': 'React' });                  // First skill
await User.find({ skills: { $size: 3 } });                 // Exactly 3 skills

// Update operators
await User.updateOne(
  { _id: id },
  {
    $set: { name: 'Ram' },           // Set field
    $inc: { loginCount: 1 },         // Increment
    $push: { skills: 'GraphQL' },    // Add to array
    $pull: { skills: 'jQuery' },     // Remove from array
    $addToSet: { skills: 'React' },  // Add only if not exists
    $unset: { tempField: '' }        // Remove field
  }
);`,
  },
  {
    id: 'mg11',
    question: 'Mongoose populate vs Aggregation $lookup',
    difficulty: 'intermediate',
    simple: 'populate() is Mongoose-level (sends multiple queries). $lookup is MongoDB-level (single query, server-side join). Use populate for simple cases, $lookup for complex joins or large datasets.',
    table: {
      headers: ['Feature', 'populate()', '$lookup'],
      rows: [
        ['Level', 'Mongoose (app layer)', 'MongoDB (server layer)'],
        ['Queries', 'Multiple (N+1 possible)', 'Single aggregation'],
        ['Performance', 'Slower (network roundtrips)', 'Faster (server-side)'],
        ['Ease of use', '✅ Very easy', 'More complex syntax'],
        ['Filtering joined data', 'Limited', 'Full pipeline support'],
      ],
    },
    code: `// populate – simple and readable
const post = await Post.findById(id)
  .populate('author', 'name email')           // Select fields
  .populate({
    path: 'comments',
    populate: { path: 'user', select: 'name' } // Nested populate
  });

// $lookup – powerful, single query
const posts = await Post.aggregate([
  { $match: { status: 'published' } },
  { $lookup: {
    from: 'users',
    localField: 'author',
    foreignField: '_id',
    as: 'authorInfo',
    pipeline: [  // Sub-pipeline (filter joined data)
      { $project: { name: 1, email: 1 } }
    ]
  }},
  { $unwind: '$authorInfo' }, // Convert array to object
  { $project: {
    title: 1,
    authorName: '$authorInfo.name',
    commentCount: { $size: '$comments' }
  }}
]);`,
  },
  {
    id: 'mg12',
    question: 'Data validation in Mongoose schemas',
    difficulty: 'intermediate',
    simple: 'Mongoose provides built-in validators (required, min, max, enum, match) and custom validators. Always validate data at the schema level as a safety net, even with front-end validation.',
    code: `const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: (v) => v >= 0 && Number.isFinite(v),
      message: 'Price must be a valid number'
    }
  },
  email: {
    type: String,
    match: [/^\\S+@\\S+\\.\\S+$/, 'Please enter a valid email'],
    unique: true
  },
  category: {
    type: String,
    enum: {
      values: ['electronics', 'clothing', 'food'],
      message: '{VALUE} is not a valid category'
    }
  },
  tags: {
    type: [String],
    validate: {
      validator: (v) => v.length <= 10,
      message: 'Cannot have more than 10 tags'
    }
  }
});

// Handle validation errors
try {
  await Product.create({ name: '', price: -5 });
} catch (err) {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    // ['Product name is required', 'Price cannot be negative']
  }
}`,
  },
  {
    id: 'mg13',
    question: 'What is MongoDB Atlas and how to use it?',
    difficulty: 'basics',
    simple: 'MongoDB Atlas is the official cloud-hosted MongoDB service. It provides managed databases with automatic backups, scaling, monitoring, and security. Most companies use Atlas instead of self-hosting.',
    points: [
      { bold: 'Free tier', text: 'M0 cluster with 512MB storage – perfect for learning/small apps' },
      { bold: 'Auto-scaling', text: 'Automatically adjusts storage and compute' },
      { bold: 'Backups', text: 'Automated snapshots and point-in-time recovery' },
      { bold: 'Security', text: 'IP whitelisting, encryption, VPC peering' },
      { bold: 'Monitoring', text: 'Real-time performance metrics and alerts' },
    ],
    code: `// Connection string from Atlas
const MONGODB_URI = 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mydb?retryWrites=true&w=majority';

// Connect with Mongoose
mongoose.connect(process.env.MONGODB_URI);

// Atlas Search (full-text search)
const results = await Product.aggregate([
  { $search: {
    index: 'default',
    text: {
      query: 'wireless headphones',
      path: ['name', 'description'],
      fuzzy: { maxEdits: 1 } // Typo tolerance
    }
  }},
  { $limit: 10 },
  { $project: {
    name: 1,
    score: { $meta: 'searchScore' }
  }}
]);`,
  },
  {
    id: 'mg14',
    question: 'Pagination strategies in MongoDB',
    difficulty: 'intermediate',
    simple: 'Two strategies: Offset-based (.skip().limit()) is simple but slow for large offsets. Cursor-based (using _id or timestamp) is efficient for infinite scroll. Choose based on your UI pattern.',
    code: `// Offset-based pagination (simple, but slow for page 1000+)
app.get('/api/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments()
  ]);
  
  res.json({
    data: users,
    page, limit,
    totalPages: Math.ceil(total / limit),
    total
  });
});

// Cursor-based pagination (efficient, ideal for infinite scroll)
app.get('/api/feed', async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  
  const query = cursor 
    ? { _id: { $lt: new mongoose.Types.ObjectId(cursor) } }
    : {};
  
  const items = await Post.find(query)
    .sort({ _id: -1 })
    .limit(parseInt(limit) + 1); // Fetch one extra to check hasNext
  
  const hasNext = items.length > limit;
  if (hasNext) items.pop(); // Remove the extra item
  
  res.json({
    data: items,
    nextCursor: hasNext ? items[items.length - 1]._id : null,
    hasNext
  });
});`,
    tip: 'For typical admin dashboards with page numbers, use offset-based. For social feeds or chat history, use cursor-based.',
  },
  {
    id: 'mg15',
    question: 'MongoDB Security best practices',
    difficulty: 'advanced',
    simple: 'Secure MongoDB with authentication, authorization (RBAC), network restrictions (IP whitelist), encryption at rest and in transit, and input sanitization against NoSQL injection.',
    code: `// 1. NoSQL Injection Prevention
// ❌ Vulnerable to injection
app.post('/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,     // Could be { "$gt": "" }
    password: req.body.password // Could be { "$gt": "" }
  });
});

// ✅ Safe – use express-mongo-sanitize
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize()); // Removes $ and . from input

// ✅ Or validate input types
app.post('/login', async (req, res) => {
  if (typeof req.body.email !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  const user = await User.findOne({ email: req.body.email });
});

// 2. Field-level encryption (sensitive data)
const userSchema = new Schema({
  name: String,
  ssn: {
    type: String,
    select: false  // Never returned in queries by default
  },
  password: {
    type: String,
    select: false
  }
});

// 3. RBAC in MongoDB
// db.createUser({
//   user: 'appUser',
//   pwd: 'securePassword',
//   roles: [{ role: 'readWrite', db: 'myapp' }]
// });`,
  },
];

export default mongodb;
