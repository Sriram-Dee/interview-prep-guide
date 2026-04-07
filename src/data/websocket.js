const websocket = [
  {
    id: 'ws1',
    question: 'What is WebSocket and how does it differ from HTTP?',
    difficulty: 'basics',
    simple: 'WebSocket is a protocol that enables real-time, bidirectional communication between client and server over a persistent connection. Unlike HTTP\'s request-response model, both sides can send data anytime without waiting.',
    table: {
      headers: ['Feature', 'HTTP', 'WebSocket'],
      rows: [
        ['Communication', 'Request-Response (one-way)', 'Full-duplex (two-way)'],
        ['Connection', 'New connection per request', 'Persistent single connection'],
        ['Overhead', 'Headers on every request', 'Minimal after handshake'],
        ['Real-time', '❌ Requires polling', '✅ Instant push'],
        ['Protocol', 'http:// or https://', 'ws:// or wss://'],
        ['Use case', 'REST APIs, static pages', 'Chat, gaming, live updates'],
      ],
    },
    code: `// WebSocket client (browser)
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('Connected!');
  ws.send(JSON.stringify({ type: 'join', room: 'general' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onclose = (event) => {
  console.log(\`Disconnected: \${event.code} \${event.reason}\`);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// WebSocket server (Node.js)
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    // Broadcast to all connected clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });
});`,
    tip: 'One-liner for interviews: "WebSocket enables real-time, bidirectional communication between client and server over a persistent connection."',
  },
  {
    id: 'ws2',
    question: 'WebSocket Handshake – How does the connection start?',
    difficulty: 'intermediate',
    simple: 'WebSocket starts with an HTTP upgrade request. The client sends an Upgrade: websocket header, and the server responds with 101 Switching Protocols. After handshake, the connection switches from HTTP to WebSocket protocol.',
    code: `// Client sends HTTP upgrade request:
// GET /chat HTTP/1.1
// Host: server.example.com
// Upgrade: websocket
// Connection: Upgrade
// Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
// Sec-WebSocket-Version: 13

// Server responds:
// HTTP/1.1 101 Switching Protocols
// Upgrade: websocket
// Connection: Upgrade
// Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

// After handshake → persistent TCP connection
// No more HTTP overhead!

// The Sec-WebSocket-Key is a random base64 value
// Server creates Sec-WebSocket-Accept by:
// 1. Concatenating key with a magic GUID
// 2. SHA-1 hashing
// 3. Base64 encoding
// This proves the server understands WebSocket protocol`,
  },
  {
    id: 'ws3',
    question: 'What is Socket.IO and how is it different from WebSocket?',
    difficulty: 'basics',
    simple: 'Socket.IO is a JavaScript library built on top of WebSocket. It provides additional features like automatic reconnection, event-based messaging, rooms/namespaces, and fallback to HTTP long-polling when WebSocket isn\'t supported.',
    table: {
      headers: ['Feature', 'Raw WebSocket', 'Socket.IO'],
      rows: [
        ['Protocol', 'WebSocket (RFC 6455)', 'Custom protocol on top of WS'],
        ['Reconnection', '❌ Manual', '✅ Automatic with backoff'],
        ['Events', 'Only message event', '✅ Custom event names'],
        ['Rooms', '❌ Manual', '✅ Built-in rooms/namespaces'],
        ['Fallback', '❌ None', '✅ HTTP long-polling fallback'],
        ['Binary', '✅ Native', '✅ Supported'],
        ['Overhead', 'Minimal', 'Slightly more (metadata)'],
        ['Interoperability', '✅ Any WS client', '❌ Only Socket.IO clients'],
      ],
    },
    code: `// Socket.IO Server
const { Server } = require('socket.io');
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Custom events (not possible with raw WS!)
  socket.on('chat:message', (data) => {
    io.emit('chat:message', data);  // Broadcast to ALL
  });
  
  // Rooms
  socket.on('join:room', (room) => {
    socket.join(room);
    socket.to(room).emit('user:joined', socket.id);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('User disconnected:', reason);
  });
});

// Socket.IO Client (React)
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on('connect', () => console.log('Connected!'));
socket.emit('chat:message', { text: 'Hello!', user: 'Sriram' });
socket.on('chat:message', (data) => setMessages(prev => [...prev, data]));`,
  },
  {
    id: 'ws4',
    question: 'Socket.IO Rooms and Namespaces – What\'s the difference?',
    difficulty: 'intermediate',
    simple: 'Namespaces are separate communication channels on the same connection (like /admin, /chat). Rooms are dynamic groups within a namespace for targeted broadcasting. Use namespaces for logical separation, rooms for grouping users.',
    code: `// NAMESPACES – separate communication channels
const adminIO = io.of('/admin');
const chatIO = io.of('/chat');

adminIO.on('connection', (socket) => {
  // Only admin-authenticated users should connect here
  console.log('Admin connected');
});

chatIO.on('connection', (socket) => {
  console.log('Chat user connected');
});

// Client connects to specific namespace
const adminSocket = io('/admin');
const chatSocket = io('/chat');

// ROOMS – groups within a namespace
io.on('connection', (socket) => {
  // Join a room
  socket.on('join:room', (roomId) => {
    socket.join(roomId);
    
    // Emit to everyone in the room EXCEPT sender
    socket.to(roomId).emit('user:joined', {
      userId: socket.id,
      room: roomId
    });
  });
  
  // Send message to specific room
  socket.on('room:message', ({ roomId, message }) => {
    io.to(roomId).emit('room:message', message); // Including sender
    // OR
    socket.to(roomId).emit('room:message', message); // Excluding sender
  });
  
  // Leave room
  socket.on('leave:room', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user:left', socket.id);
  });
  
  // Broadcast to all rooms
  socket.on('broadcast', (data) => {
    io.emit('announcement', data); // All connected clients
  });
});`,
  },
  {
    id: 'ws5',
    question: 'How to handle reconnection and connection failures?',
    difficulty: 'intermediate',
    simple: 'Socket.IO handles reconnection automatically with exponential backoff. For raw WebSocket, implement manual reconnection logic with increasing delays and jitter to avoid thundering herd problem.',
    code: `// Socket.IO automatic reconnection (built-in!)
const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,       // Start at 1s
  reconnectionDelayMax: 30000,   // Max 30s
  randomizationFactor: 0.5       // ±50% jitter
});

socket.on('connect', () => console.log('Connected'));
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  // 'io server disconnect' → server kicked you
  // 'transport close' → network issue
});
socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
});
socket.on('reconnect_failed', () => {
  console.log('Failed to reconnect. Show error UI.');
});

// Raw WebSocket – manual reconnection
class ReconnectingWebSocket {
  constructor(url) {
    this.url = url;
    this.reconnectDelay = 1000;
    this.maxDelay = 30000;
    this.connect();
  }
  
  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      this.reconnectDelay = 1000; // Reset on success
    };
    
    this.ws.onclose = () => {
      // Exponential backoff with jitter
      const jitter = Math.random() * 1000;
      const delay = Math.min(this.reconnectDelay + jitter, this.maxDelay);
      setTimeout(() => this.connect(), delay);
      this.reconnectDelay *= 2; // Double delay each attempt
    };
  }
}`,
  },
  {
    id: 'ws6',
    question: 'WebSocket Authentication – How to secure connections?',
    difficulty: 'advanced',
    simple: 'Authenticate during the handshake, not after. Send JWT tokens as query parameters or cookies during connection. Verify the token in the Socket.IO middleware before allowing the connection.',
    code: `// Server – Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token || 
                socket.handshake.query.token;
  
  if (!token) {
    return next(new Error('Authentication required'));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user to socket
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('Authenticated user:', socket.user.name);
  
  // Auto-join user to their personal room
  socket.join(\`user:\${socket.user.id}\`);
});

// Client – send token on connection
const socket = io('http://localhost:3000', {
  auth: {
    token: localStorage.getItem('jwt')
  }
});

socket.on('connect_error', (err) => {
  if (err.message === 'Authentication required') {
    // Redirect to login
    window.location.href = '/login';
  }
});`,
  },
  {
    id: 'ws7',
    question: 'Scaling WebSocket servers horizontally',
    difficulty: 'expert',
    simple: 'WebSocket connections are stateful – each client is connected to ONE server. To scale horizontally, use Redis Pub/Sub as a message broker so servers can communicate. Also use sticky sessions with a load balancer.',
    code: `// Problem: Client A → Server 1, Client B → Server 2
// Server 1 can't send to Client B directly!

// Solution: Redis adapter for Socket.IO
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');

const pubClient = createClient({ url: 'redis://redis:6379' });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient));
  console.log('Socket.IO adapter connected to Redis');
});

// Now io.emit() reaches ALL clients across ALL servers!
io.emit('announcement', 'This reaches everyone!');

// Sticky sessions with nginx
// upstream websocket {
//   ip_hash;  # Sticky sessions based on client IP
//   server server1:3000;
//   server server2:3000;
// }
// 
// server {
//   location /socket.io/ {
//     proxy_pass http://websocket;
//     proxy_http_version 1.1;
//     proxy_set_header Upgrade $http_upgrade;
//     proxy_set_header Connection "upgrade";
//   }
// }`,
    tip: 'In your CIA project, if you had multiple WebSocket servers, you\'d use Redis adapter. This is a common follow-up question.',
  },
  {
    id: 'ws8',
    question: 'WebSocket vs SSE vs Long Polling – When to use what?',
    difficulty: 'intermediate',
    simple: 'WebSocket: bidirectional real-time (chat, gaming). SSE: server-to-client only (notifications, feeds). Long Polling: fallback when neither available. Choose the simplest option that meets your needs.',
    table: {
      headers: ['Feature', 'WebSocket', 'SSE (Server-Sent Events)', 'Long Polling'],
      rows: [
        ['Direction', 'Bidirectional', 'Server → Client only', 'Client → Server (simulated)'],
        ['Protocol', 'ws://', 'HTTP', 'HTTP'],
        ['Complexity', 'Medium', 'Low', 'Low'],
        ['Reconnection', 'Manual / Socket.IO', '✅ Built-in', 'Manual'],
        ['Binary data', '✅ Yes', '❌ Text only', '❌ Text only'],
        ['Best for', 'Chat, gaming, collab', 'Notifications, feeds', 'Fallback compatibility'],
      ],
    },
    code: `// SSE – Server-Sent Events (simple, server → client only)
// Server
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const sendEvent = (data) => {
    res.write(\`data: \${JSON.stringify(data)}\\n\\n\`);
  };
  
  // Send updates every 5 seconds
  const interval = setInterval(() => {
    sendEvent({ price: Math.random() * 100 });
  }, 5000);
  
  req.on('close', () => clearInterval(interval));
});

// Client
const eventSource = new EventSource('/api/events');
eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Stock price:', data.price);
};

// Use WebSocket when: bidirectional, high-frequency, binary data
// Use SSE when: server push only, simple updates, auto-reconnect needed
// Use Polling when: compatibility, infrequent updates`,
  },
  {
    id: 'ws9',
    question: 'Building a real-time chat with Socket.IO and React',
    difficulty: 'intermediate',
    simple: 'A typical real-time chat needs: connection management, message broadcasting, room support, typing indicators, and online status. Use Socket.IO with React hooks for clean integration.',
    code: `// Custom React hook for Socket.IO
import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

function useSocket(url) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    socketRef.current = io(url, {
      auth: { token: localStorage.getItem('jwt') }
    });
    
    socketRef.current.on('connect', () => setIsConnected(true));
    socketRef.current.on('disconnect', () => setIsConnected(false));
    
    return () => socketRef.current.disconnect();
  }, [url]);
  
  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);
  
  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);
  
  return { socket: socketRef.current, isConnected, emit, on };
}

// Chat Component
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const { emit, on, isConnected } = useSocket('http://localhost:3000');
  
  useEffect(() => {
    emit('join:room', roomId);
    
    const cleanup = on('chat:message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });
    
    return cleanup;
  }, [roomId, emit, on]);
  
  const sendMessage = (text) => {
    emit('chat:message', { roomId, text, timestamp: Date.now() });
  };
  
  return (
    <div>
      <div>{isConnected ? '🟢 Online' : '🔴 Offline'}</div>
      {messages.map((msg, i) => <Message key={i} {...msg} />)}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}`,
    tip: 'In your CIA project you built WebSocket-based device management with Socket.IO – describe this architecture when asked about real-time systems.',
  },
  {
    id: 'ws10',
    question: 'WebSocket heartbeat and keeping connections alive',
    difficulty: 'advanced',
    simple: 'Heartbeats (ping/pong frames) detect dead connections. WebSocket protocol has built-in ping/pong. Socket.IO uses its own ping mechanism. Without heartbeats, zombie connections waste resources.',
    code: `// Raw WebSocket – custom heartbeat
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

// Server-side heartbeat
wss.on('connection', (ws) => {
  ws.isAlive = true;
  
  ws.on('pong', () => {
    ws.isAlive = true; // Client responded to ping
  });
});

// Check all connections every 30 seconds
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      console.log('Terminating dead connection');
      return ws.terminate();
    }
    
    ws.isAlive = false;
    ws.ping(); // Send ping, expect pong back
  });
}, 30000);

wss.on('close', () => clearInterval(interval));

// Socket.IO heartbeat (built-in!)
const io = new Server(httpServer, {
  pingInterval: 25000,  // Send ping every 25s
  pingTimeout: 20000,   // Wait 20s for pong
  // If no pong → disconnect
});

// WebSocket close codes
// 1000 – Normal closure
// 1001 – Going away (page navigation)
// 1006 – Abnormal closure (no close frame)
// 1008 – Policy violation
// 1011 – Server error`,
  },
  {
    id: 'ws11',
    question: 'Real-time notifications system architecture',
    difficulty: 'advanced',
    simple: 'A notification system uses WebSocket for instant delivery, a message queue (Redis/RabbitMQ) for reliability, and a database for persistence. Send notifications to specific users via personal rooms.',
    code: `// Server architecture
// 1. API creates notification → saves to DB → publishes to Redis
// 2. WebSocket server subscribes to Redis → pushes to connected user
// 3. Offline users get notifications when they reconnect

// Step 1: API creates notification
app.post('/api/notifications', async (req, res) => {
  const notification = await Notification.create({
    userId: req.body.userId,
    type: req.body.type,     // 'message', 'like', 'follow'
    content: req.body.content,
    read: false
  });
  
  // Push to connected user via Socket.IO
  io.to(\`user:\${req.body.userId}\`).emit('notification', notification);
  
  res.status(201).json(notification);
});

// Step 2: User connects → fetch unread notifications
io.on('connection', async (socket) => {
  const userId = socket.user.id;
  socket.join(\`user:\${userId}\`);
  
  // Send unread notifications on connect
  const unread = await Notification.find({ userId, read: false })
    .sort({ createdAt: -1 })
    .limit(50);
  
  socket.emit('notifications:unread', unread);
  
  // Mark as read
  socket.on('notification:read', async (notifId) => {
    await Notification.findByIdAndUpdate(notifId, { read: true });
  });
});

// React hook for notifications
function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const { on } = useSocket();
  
  useEffect(() => {
    return on('notification', (notif) => {
      setNotifications(prev => [notif, ...prev]);
      // Show toast notification
      showToast(notif.content);
    });
  }, [on]);
  
  return { notifications };
}`,
  },
  {
    id: 'ws12',
    question: 'WebSocket message framing and binary data',
    difficulty: 'expert',
    simple: 'WebSocket messages are sent in frames: text frames (UTF-8) or binary frames (ArrayBuffer/Blob). Control frames handle ping/pong and close. Client frames are masked for security; server frames are not.',
    code: `// Text messages (default, JSON)
socket.send(JSON.stringify({ type: 'chat', text: 'Hello!' }));

// Binary data (images, files, audio)
// Server
const fs = require('fs');
ws.on('message', (data, isBinary) => {
  if (isBinary) {
    // Save uploaded file
    fs.writeFileSync('upload.png', data);
  } else {
    // Parse JSON text
    const msg = JSON.parse(data.toString());
  }
});

// Client – send binary (image upload via WebSocket)
const input = document.querySelector('input[type=file]');
input.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    ws.send(reader.result); // Sends as ArrayBuffer
  };
  reader.readAsArrayBuffer(file);
});

// Socket.IO handles both automatically
socket.emit('upload', {
  filename: 'photo.png',
  data: fileBuffer  // Binary data
});

// Compression (permessage-deflate)
const wss = new WebSocket.Server({
  port: 3000,
  perMessageDeflate: {
    zlibDeflateOptions: { chunkSize: 1024, level: 3 }
  }
});`,
  },
];

export default websocket;
