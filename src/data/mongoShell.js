const mongoShell = [
  {
    id: 'msh1',
    question: 'Connecting and Basic Administration',
    difficulty: 'basics',
    simple: 'Commands to connect to MongoDB and manage databases and collections directly from the terminal.',
    table: {
      headers: ['Command Category', 'Command', 'Description'],
      rows: [
        ['Connection', 'mongosh "mongodb+srv://..."', 'Connect to a remote cluster'],
        ['Connection', 'mongosh', 'Connect to local instance on default port'],
        ['Databases', 'show dbs', 'List all databases'],
        ['Databases', 'use <db_name>', 'Switch to a specific database'],
        ['Databases', 'db', 'Show current database name'],
        ['Collections', 'show collections', 'List collections in the current database'],
        ['Collections', 'db.createCollection("name")', 'Create a new collection'],
        ['Collections', 'db.<name>.drop()', 'Delete a collection'],
      ],
    },
    code: `// Connect with username and password
// $ mongosh "mongodb+srv://cluster0.xxxxx.mongodb.net/mydb" --username myuser

// Switch to a database and create a collection
use myAppStore
db.createCollection("users")

// Check database stats
db.stats()`,
  },
  {
    id: 'msh2',
    question: 'CRUD Operations in mongosh',
    difficulty: 'intermediate',
    simple: 'How to create, read, update, and delete documents using the shell JavaScript interface. mongosh intelligently formats output.',
    code: `// INSERT
db.users.insertOne({ name: "John Doe", role: "developer", age: 25 })
db.users.insertMany([
  { name: "John", role: "admin" },
  { name: "Jane", role: "user" }
])

// READ
db.users.find()                      // Get multiple documents
db.users.find({ age: { $gt: 21 } })  // Query with operators
db.users.findOne({ name: "John Doe" }) // Get single document

// UPDATE
db.users.updateOne({ name: "John Doe" }, { $set: { role: "lead" } })
db.users.updateMany({}, { $inc: { loginCount: 1 } })

// DELETE
db.users.deleteOne({ name: "John" })
db.users.deleteMany({ role: "deleted" })`,
    tip: 'The MongoDB shell is a JS engine! You can write scripts: for(let i=0; i<10; i++) db.users.insertOne({age: i})',
  },
  {
    id: 'msh3',
    question: 'Database Backup and Restore (CLI Tools)',
    difficulty: 'advanced',
    simple: 'MongoDB provides standalone command-line tools (not inside mongosh) for backup, restore, and data import/export.',
    table: {
      headers: ['Tool', 'Command Example', 'Use Case'],
      rows: [
        ['mongodump', 'mongodump --uri="..." --out=backup/', 'Backup database to BSON files'],
        ['mongorestore', 'mongorestore --uri="..." backup/', 'Restore BSON files back to DB'],
        ['mongoexport', 'mongoexport --uri="..." --collection=users --out=users.json', 'Export collection to JSON/CSV'],
        ['mongoimport', 'mongoimport --uri="..." --collection=users --file=users.json', 'Import JSON/CSV to a collection'],
      ],
    },
    warning: 'These tools (mongodump/mongorestore) are run directly in your OS terminal (bash/cmd), NOT inside the mongosh prompt.',
  }
];

export default mongoShell;
