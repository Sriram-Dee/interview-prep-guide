const reactAdvanced = [
  {
    id: 'ra1',
    question: 'How does React Reconciliation work?',
    difficulty: 'advanced',
    simple: 'Reconciliation is React\'s algorithm for updating the DOM efficiently. It uses two assumptions: (1) Different element types produce different trees, (2) Keys identify stable elements across renders. This makes it O(n) instead of O(n³).',
    detailed: [],
    points: [
      { bold: 'Different types', text: 'If root elements have different types (e.g., <div> → <span>), React destroys the old tree and builds a new one' },
      { bold: 'Same type', text: 'If same type, React only updates changed attributes/props' },
      { bold: 'Keys', text: 'Keys in lists tell React "this is the same item" across renders' },
      { bold: 'Batching', text: 'React batches DOM updates for performance' },
    ],
    code: `// Different types → destroy & rebuild entire subtree
<div><Counter /></div>  →  <span><Counter /></span>
// Counter is unmounted and remounted (state lost!)

// Same type → update attributes only
<div className="old" />  →  <div className="new" />
// Only className attribute changes in DOM

// Keys help identify items in lists
<li key="a">Item A</li>  // React tracks by key, not position
<li key="b">Item B</li>  // Reorder? React moves DOM, not recreate`,
  },
  {
    id: 'ra2',
    question: 'What is React Fiber Architecture?',
    difficulty: 'advanced',
    simple: 'Fiber is React\'s internal reconciliation engine (React 16+). It breaks rendering into small units of work that can be paused, prioritized, and resumed – enabling Concurrent Mode features.',
    detailed: [],
    points: [
      { bold: 'Fiber node', text: 'JS object representing a component, with links to child/sibling/parent' },
      { bold: 'Render phase', text: '(interruptible): builds fiber tree, determines changes' },
      { bold: 'Commit phase', text: '(non-interruptible): applies changes to DOM' },
      { bold: 'Priority lanes', text: 'SyncLane (clicks) > InputContinuousLane (drag) > DefaultLane > IdleLane' },
    ],
    code: `// Fiber enables priority-based rendering:
// 1. User types in search → HIGH priority (must feel instant)
// 2. Search results render → LOW priority (can be interrupted)

function SearchPage() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setInput(e.target.value);        // HIGH priority
    startTransition(() => {
      setQuery(e.target.value);      // LOW priority (Fiber can interrupt)
    });
  };
}`,
  },
  {
    id: 'ra3',
    question: 'Error Boundaries – How to catch rendering errors?',
    difficulty: 'advanced',
    simple: 'Error Boundaries are class components that catch JS errors in their child tree and display a fallback UI instead of crashing the entire app. They use componentDidCatch and getDerivedStateFromError.',
    code: `class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logErrorToService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Something went wrong</h1>;
    }
    return this.props.children;
  }
}

// Usage: wrap sections independently
<ErrorBoundary fallback={<p>Sidebar crashed</p>}>
  <Sidebar />
</ErrorBoundary>
<ErrorBoundary fallback={<p>Content crashed</p>}>
  <MainContent />
</ErrorBoundary>

// Does NOT catch: event handlers, async code, SSR, errors in boundary itself
// For events: use try/catch inside the handler`,
  },
  {
    id: 'ra4',
    question: 'Concurrent Mode – useTransition & useDeferredValue',
    difficulty: 'advanced',
    simple: 'Concurrent Mode lets React work on multiple renders simultaneously. useTransition marks updates as non-urgent (can be interrupted). useDeferredValue defers updating a value until urgent work finishes.',
    code: `// useTransition – keep UI responsive during expensive updates
function FilteredList({ items }) {
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleFilter = (e) => {
    setFilter(e.target.value);               // instant
    startTransition(() => {
      setFilteredItems(expensiveFilter(items, e.target.value)); // deferrable
    });
  };

  return (
    <>
      <input value={filter} onChange={handleFilter} />
      {isPending ? <Spinner /> : <List items={filteredItems} />}
    </>
  );
}

// useDeferredValue – defer a value
function Search({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery updates after urgent renders complete
  return <HeavyResults query={deferredQuery} />;
}`,
  },
  {
    id: 'ra5',
    question: 'React Server Components (RSC) explained',
    difficulty: 'expert',
    simple: 'Server Components run ONLY on the server – they can access databases directly, have zero client bundle size, but can\'t use hooks or browser APIs. Use \'use client\' directive for interactive components.',
    code: `// Server Component (default in Next.js App Router)
// ✅ Can: access DB, files, environment vars
// ❌ Can't: useState, onClick, browser APIs
async function PostsList() {
  const posts = await db.posts.findMany(); // Direct DB access!
  return posts.map(p => <PostCard key={p.id} post={p} />);
}

// Client Component – needs interactivity
'use client'; // ← This directive makes it a client component
import { useState } from 'react';
export function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? '❤️' : '🤍'}</button>;
}

// Benefits: Zero bundle for server code, direct backend access, streaming UI`,
  },
  {
    id: 'ra6',
    question: 'Code Splitting and React.lazy with Suspense',
    difficulty: 'advanced',
    simple: 'Code splitting loads components on demand instead of bundling everything upfront. Use React.lazy() + Suspense to lazy-load components, reducing initial bundle size.',
    code: `import { lazy, Suspense } from 'react';

// Lazy-load heavy components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
// Dashboard JS only downloads when user navigates to /dashboard`,
    tip: 'Mention that in your projects you used route-based code splitting to reduce initial load time, especially for the admin panels with heavy chart libraries.',
  },
  {
    id: 'ra7',
    question: 'forwardRef and useImperativeHandle',
    difficulty: 'advanced',
    simple: 'forwardRef passes a ref through a component to its child DOM element. useImperativeHandle customizes what the parent can access via that ref.',
    code: `// forwardRef – expose child's DOM to parent
const TextInput = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

function Parent() {
  const inputRef = useRef(null);
  return (
    <>
      <TextInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}

// useImperativeHandle – control what's exposed
const VideoPlayer = forwardRef((props, ref) => {
  const videoRef = useRef(null);
  useImperativeHandle(ref, () => ({
    play: () => videoRef.current.play(),
    pause: () => videoRef.current.pause(),
    // parent can't access other DOM methods
  }));
  return <video ref={videoRef} {...props} />;
});`,
  },
  {
    id: 'ra8',
    question: 'useEffect vs useLayoutEffect',
    difficulty: 'advanced',
    simple: 'useEffect runs asynchronously AFTER the browser paints. useLayoutEffect runs synchronously BEFORE paint – use it for DOM measurements to prevent visual flicker.',
    table: {
      headers: ['Aspect', 'useEffect', 'useLayoutEffect'],
      rows: [
        ['Timing', 'After paint (async)', 'Before paint (sync)'],
        ['Blocks rendering', 'No', 'Yes'],
        ['Use for', 'Data fetching, subscriptions', 'DOM measurements, preventing flicker'],
        ['Default choice', '✅ Prefer this', 'Only when needed'],
      ],
    },
    code: `// useLayoutEffect: measure DOM before user sees anything
function Tooltip({ anchorRef, content }) {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom, left: rect.left });
  }, [anchorRef]);

  return <div style={{ position: 'absolute', ...pos }}>{content}</div>;
}`,
  },
];

export default reactAdvanced;
