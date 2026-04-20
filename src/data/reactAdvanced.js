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
  {
    id: 'ra9',
    question: 'What is React Fiber and why was it introduced?',
    difficulty: 'expert',
    simple: 'React Fiber is a complete rewrite of React\'s rendering engine (introduced in React 16). It breaks rendering work into small chunks that can be paused, prioritized, and resumed — making React feel fast even during heavy UI updates.',
    detailed: [
      'Before Fiber, React\'s rendering was fully synchronous. Once it started updating the UI, it could not stop — even if the browser needed to handle a button click or a scroll event. This caused noticeable freezes on heavy pages.',
      'Fiber solves this by splitting rendering into units of work. React can now stop in the middle of an update, handle something urgent like a user keystroke, and then return to finish the update.',
    ],
    points: [
      { bold: 'Interruptible rendering', text: 'React can pause mid-update for higher-priority work like user input.' },
      { bold: 'Priority lanes', text: 'Each update has a priority: SyncLane (clicks) > DefaultLane (data fetch) > IdleLane (background work).' },
      { bold: 'Two phases', text: 'Render phase (can be interrupted) builds a work-in-progress tree. Commit phase (never interrupted) writes changes to the real DOM.' },
      { bold: 'Enables Concurrent Features', text: 'useTransition, useDeferredValue, and Suspense streaming are all built on top of Fiber\'s interruptible model.' },
    ],
    code: `// Without Fiber: typing in a search box felt laggy
// because React was busy rendering 1000 filtered results.

// With Fiber + startTransition: input stays instant
function SearchPage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setInput(e.target.value);        // HIGH priority – instant
    startTransition(() => {
      setResults(filterItems(e.target.value)); // LOW priority – Fiber can pause this
    });
  };

  return (
    <>
      <input value={input} onChange={handleChange} />
      {isPending ? <Spinner /> : <ResultList items={results} />}
    </>
  );
}`,
    tip: 'Interviewers love this question. Say: "Fiber makes rendering asynchronous and interruptible, which is the foundation for all of React 18\'s concurrent features."',
  },
  {
    id: 'ra10',
    question: 'How does React decide when to re-render a component?',
    difficulty: 'advanced',
    simple: 'React re-renders a component when its state changes, its props change, or its parent re-renders. But by default, React uses reference equality — NOT deep comparison. So even if data "looks" the same, a new object or array reference will still trigger a re-render.',
    detailed: [
      'This shallow comparison behavior is one of the most common sources of performance bugs. For example, passing an inline object as a prop — like style={{ color: "red" }} — creates a brand new object on every render, even though the values are identical.',
      'That\'s why React gives us memoization tools: to explicitly tell it "don\'t re-render unless the real data has changed."',
    ],
    points: [
      { bold: 'State change', text: 'Calling setState or a state setter from useState always queues a re-render.' },
      { bold: 'Prop change', text: 'If the parent passes a new value (even a new object with same data), the child re-renders.' },
      { bold: 'Parent re-renders', text: 'By default, all children re-render when the parent does — even if their props didn\'t change.' },
      { bold: 'Context change', text: 'Any component consuming a context will re-render when that context value changes.' },
    ],
    code: `// Problem: new object reference on every render
function Parent() {
  const [count, setCount] = useState(0);

  // ❌ New object every render → Child always re-renders
  return <Child config={{ theme: 'dark' }} />;
}

// Fix 1: useMemo – stable object reference
function Parent() {
  const [count, setCount] = useState(0);
  const config = useMemo(() => ({ theme: 'dark' }), []); // created once

  return <Child config={config} />;
}

// Fix 2: React.memo – skip render if props didn't change
const Child = React.memo(({ config }) => {
  return <div>{config.theme}</div>;
});

// Fix 3: Move state down – only affected component re-renders
// Instead of holding count in Parent, move it into its own Counter component`,
    warning: 'React.memo and useMemo are NOT free — they add memory overhead and comparison cost. Only apply them when you\'ve confirmed there\'s a real performance problem.',
  },
  {
    id: 'ra11',
    question: 'What is automatic batching in React 18 and how is it different from React 17?',
    difficulty: 'advanced',
    simple: 'Batching means React groups multiple state updates into a single re-render. In React 17, this only worked inside event handlers. React 18 extended it to work everywhere — including inside setTimeout, fetch callbacks, and Promises.',
    detailed: [
      'Before React 18, if you called setState twice inside a fetch().then() block, React would trigger two separate renders. This was wasteful and sometimes caused visual flickers.',
      'React 18 quietly fixed this with "automatic batching" — all state updates are now batched by default, no matter where they happen. You get fewer renders and better performance without changing any code.',
    ],
    code: `// React 17 behavior: 2 renders inside async code
fetch('/api/data').then(() => {
  setLoading(false);   // render #1
  setData(response);   // render #2
});

// React 18 behavior: only 1 render (automatic batching)
fetch('/api/data').then(() => {
  setLoading(false);   // batched
  setData(response);   // batched → single render
});

// What if you DON'T want batching? Use flushSync:
import { flushSync } from 'react-dom';
flushSync(() => setCount(1)); // forces immediate render
flushSync(() => setFlag(true)); // then another render`,
    tip: 'React 18\'s automatic batching is a free performance win — you get it just by upgrading and using createRoot() instead of ReactDOM.render().',
  },
  {
    id: 'ra12',
    question: 'What is React Suspense and how can it be used beyond lazy loading?',
    difficulty: 'advanced',
    simple: 'Suspense lets you declaratively handle loading states. While a component is "waiting" for something (a lazy import, data, etc.), React shows a fallback UI. In React 18+, it works beyond just lazy() — it powers data loading with frameworks like Next.js, React Query, and Relay.',
    detailed: [
      'Most developers know Suspense only for lazy-loading components. But its true power is as a loading boundary — similar to how ErrorBoundary catches errors, Suspense catches "not ready yet" states.',
      'When a component throws a Promise (which is what Suspense-aware libraries do internally), React catches it, shows the fallback, and re-renders the component once the Promise resolves.',
    ],
    points: [
      { bold: 'Lazy loading', text: 'The classic use case — wrapping React.lazy() imports to show a spinner while the chunk loads.' },
      { bold: 'Data fetching', text: 'With Next.js App Router, React Query experimental mode, or Relay — Suspense can manage async data loading too.' },
      { bold: 'Streaming SSR', text: 'In Next.js, Suspense boundaries let the server stream HTML progressively — fast parts arrive first, slow parts fill in later.' },
      { bold: 'Coordinated loading', text: 'Nest multiple Suspense boundaries to control exactly which parts of the page wait for what.' },
    ],
    code: `import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

// Basic: lazy loading a component
function Dashboard() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart />
    </Suspense>
  );
}

// Advanced: nested boundaries — different fallbacks per section
function Page() {
  return (
    <Suspense fallback={<PageSkeleton />}>   {/* outer: whole page */}
      <Header />
      <Suspense fallback={<FeedSkeleton />}> {/* inner: just the feed */}
        <NewsFeed />
      </Suspense>
    </Suspense>
  );
}`,
    tip: 'In interviews: "Suspense is not just for code splitting — it\'s React\'s native way to handle any asynchronous dependency, and it\'s how Next.js 13+ does streaming server-side rendering."',
  },
  {
    id: 'ra13',
    question: 'What is the difference between useRef and useState?',
    difficulty: 'advanced',
    simple: 'useState holds values that React tracks — changing them triggers a re-render. useRef holds values that React ignores — changing them does NOT trigger a re-render. Use useRef for DOM access and for remembering values between renders without causing UI updates.',
    table: {
      headers: ['Aspect', 'useState', 'useRef'],
      rows: [
        ['Causes re-render?', 'Yes — always', 'No — never'],
        ['Access value', 'Directly: count', 'Via .current: ref.current'],
        ['Use for', 'Values that drive the UI', 'DOM refs, timers, previous values'],
        ['Persists across renders?', 'Yes', 'Yes'],
        ['Mutable?', 'Via setter only', 'Directly (ref.current = x)'],
      ],
    },
    code: `// useState: tracks a counter visible in the UI
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// useRef: track how many times a component rendered (silent — no UI update)
function RenderCounter() {
  const renderCount = useRef(0);
  renderCount.current += 1; // mutate directly — no re-render triggered

  return <p>Rendered {renderCount.current} times</p>;
}

// useRef: store a timer without causing re-renders
function Stopwatch() {
  const timerRef = useRef(null);

  const start = () => {
    timerRef.current = setInterval(() => console.log('tick'), 1000);
  };
  const stop = () => clearInterval(timerRef.current);

  return <><button onClick={start}>Start</button><button onClick={stop}>Stop</button></>;
}`,
    tip: 'A classic interview trick question: "If I useRef(0) and increment ref.current, will the component re-render?" — Answer: No. React has no idea ref.current changed.',
  },
  {
    id: 'ra14',
    question: 'What is hydration in React SSR and what causes hydration errors?',
    difficulty: 'expert',
    simple: 'Hydration is the process of attaching React\'s JavaScript behavior to HTML that was already rendered on the server. If the client renders different HTML than the server, React throws a hydration mismatch warning and the UI can break.',
    detailed: [
      'During SSR, the server sends a complete HTML string to the browser. The user sees the page immediately. Then React\'s JavaScript bundle loads and "hydrates" that HTML — attaching event listeners and making it interactive.',
      'The problem: React expects the client render to produce the exact same HTML as the server. If anything differs (even whitespace), you get a mismatch. React recovers by re-rendering from scratch on the client, but this defeats the purpose of SSR.',
    ],
    points: [
      { bold: 'Using Math.random() or Date.now()', text: 'These produce different values on server vs client, causing a mismatch.' },
      { bold: 'Accessing browser-only APIs', text: 'window, localStorage, or navigator don\'t exist on the server — guard them with typeof window !== "undefined".' },
      { bold: 'Missing Suspense wrappers', text: 'Async components without a Suspense boundary can cause the server and client to be out of sync.' },
      { bold: 'Conditional rendering based on client state', text: 'e.g., showing a "logged in" UI immediately on server while the user isn\'t authenticated yet.' },
    ],
    code: `// ❌ Causes hydration mismatch — Math.random() differs each run
function Card() {
  return <div id={Math.random()}>Content</div>;
}

// ❌ window doesn't exist on server
function ThemeToggle() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return <button>{isDark ? 'Light' : 'Dark'} Mode</button>;
}

// ✅ Fix: use useEffect (runs only on client, after hydration)
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false); // safe default for SSR

  useEffect(() => {
    // This runs AFTER hydration — client only
    setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
  }, []);

  return <button>{isDark ? 'Light' : 'Dark'} Mode</button>;
}

// ✅ Fix for Next.js: suppressHydrationWarning for intentional differences
<time suppressHydrationWarning>{new Date().toLocaleString()}</time>`,
    warning: 'Hydration errors in production are silent to users but cause a full client-side re-render, eliminating the performance benefits of SSR. Always test your SSR app with JavaScript disabled first.',
  },
];

export default reactAdvanced;
