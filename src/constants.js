export const SECTIONS = [
  {
    group: 'My Prep',
    items: [
      { id: 'important', label: 'Starred / Important', icon: '⭐', countId: 'count-important' },
    ],
  },
  {
    group: 'React Core',
    items: [
      { id: 'react-basics', label: 'Basics', icon: '🌱', countId: 'count-basics' },
      { id: 'react-hooks', label: 'Hooks Deep Dive', icon: '🪝', countId: 'count-hooks' },
      { id: 'react-advanced', label: 'Advanced Concepts', icon: '🚀', countId: 'count-advanced' },
    ],
  },
  {
    group: 'Architecture',
    items: [
      { id: 'react-patterns', label: 'Patterns & Design', icon: '🏗️', countId: 'count-patterns' },
      { id: 'react-perf', label: 'Performance', icon: '⚡', countId: 'count-perf' },
      { id: 'react-ecosystem', label: 'Ecosystem & Tools', icon: '🌐', countId: 'count-ecosystem' },
    ],
  },
  {
    group: 'Backend & Database',
    items: [
      { id: 'nodejs', label: 'Node.js', icon: '💚', countId: 'count-nodejs' },
      { id: 'expressjs', label: 'Express.js', icon: '🛤️', countId: 'count-expressjs' },
      { id: 'mongodb', label: 'MongoDB', icon: '🍃', countId: 'count-mongodb' },
      { id: 'mongo-shell', label: 'Mongo Shell', icon: '💻', countId: 'count-mongo-shell' },
      { id: 'websocket', label: 'WebSocket & Socket.IO', icon: '🔌', countId: 'count-websocket' },
    ],
  },
  {
    group: 'General',
    items: [
      { id: 'js-fundamentals', label: 'JavaScript Core', icon: '📜', countId: 'count-js' },
      { id: 'behavioral', label: 'Behavioral & HR', icon: '💬', countId: 'count-behavioral' },
      { id: 'negotiation', label: 'Salary & Tips', icon: '💰', countId: 'count-negotiation' },
    ],
  },
];

export const SECTION_META = {
  'important': { overline: 'My Prep · Highlights', title: 'Starred Questions', description: 'Questions you have marked as important for quick review' },
  'react-basics': { overline: 'React Core · Fundamentals', title: 'React Basics', description: 'Foundation concepts every React developer must know – the building blocks of everything else' },
  'react-hooks': { overline: 'React Core · Hooks', title: 'Hooks Deep Dive', description: 'Master every React hook – from useState to custom hooks, with real-world patterns' },
  'react-advanced': { overline: 'React Core · Advanced', title: 'Advanced React Concepts', description: 'Reconciliation, Fiber, Concurrent Mode, Server Components & more' },
  'react-patterns': { overline: 'Architecture · Patterns', title: 'React Patterns & Design', description: 'Component patterns, state management architecture & design decisions' },
  'react-perf': { overline: 'Architecture · Performance', title: 'Performance Optimization', description: 'Rendering optimization, profiling, code splitting & production-grade techniques' },
  'react-ecosystem': { overline: 'Architecture · Ecosystem', title: 'React Ecosystem & Tools', description: 'React Router, Redux, Testing, Next.js, data fetching & the MERN stack' },
  'nodejs': { overline: 'Backend · Runtime', title: 'Node.js Interview Questions', description: 'Event Loop, Streams, Cluster, Worker Threads, modules & production Node.js' },
  'expressjs': { overline: 'Backend · Framework', title: 'Express.js Interview Questions', description: 'Middleware, routing, REST API design, authentication, security & best practices' },
  'mongodb': { overline: 'Database · NoSQL', title: 'MongoDB Interview Questions', description: 'Schema design, aggregation, indexing, Mongoose ODM, transactions & scaling' },
  'mongo-shell': { overline: 'Database · CLI', title: 'MongoDB Shell Commands', description: 'Terminal commands for MongoDB connection, administration, and CRUD operations' },
  'websocket': { overline: 'Real-Time · Protocol', title: 'WebSocket & Socket.IO', description: 'Real-time communication, WebSocket protocol, Socket.IO features, rooms & scaling' },
  'js-fundamentals': { overline: 'General · JavaScript', title: 'JavaScript Core Concepts', description: 'Essential JS concepts interviewers love to ask – closures, promises, event loop & more' },
  'behavioral': { overline: 'General · Behavioral', title: 'Behavioral & HR Questions', description: 'Tell me about yourself, strengths, weaknesses, and project-specific questions tailored to your resume' },
  'negotiation': { overline: 'General · Career', title: 'Salary Negotiation & Interview Tips', description: 'How to negotiate salary, handle notice period questions, counter offers & more' },
};
