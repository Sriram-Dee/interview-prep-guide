const reactHooks = [
  {
    id: 'rh1',
    question: 'What are React Hooks? Rules of Hooks?',
    difficulty: 'intermediate',
    simple: 'Hooks are functions that let functional components use state, lifecycle, and other React features. Two rules: (1) Only call hooks at the top level (no loops/conditions), (2) Only call from React functions or custom hooks.',
    detailed: ['Hooks were introduced in React 16.8 to eliminate the need for class components. Built-in hooks:'],
    points: [
      { bold: 'useState', text: 'State management' },
      { bold: 'useEffect', text: 'Side effects (data fetching, subscriptions)' },
      { bold: 'useContext', text: 'Access context values' },
      { bold: 'useReducer', text: 'Complex state logic' },
      { bold: 'useRef', text: 'DOM refs & mutable values' },
      { bold: 'useMemo / useCallback', text: 'Performance optimization' },
      { bold: 'useLayoutEffect', text: 'Synchronous DOM measurements' },
      { bold: 'useTransition / useDeferredValue', text: 'Concurrent features (React 18+)' },
    ],
    code: `// ❌ WRONG: Hook inside condition
function Bad({ show }) {
  if (show) {
    const [val, setVal] = useState(''); // BREAKS!
  }
}

// ✅ CORRECT: Always at top level
function Good({ show }) {
  const [val, setVal] = useState('');
  if (!show) return null;
  return <input value={val} onChange={e => setVal(e.target.value)} />;
}`,
  },
  {
    id: 'rh2',
    question: 'useState – How does it work? Common patterns?',
    difficulty: 'intermediate',
    simple: 'useState declares a state variable. It returns [currentValue, setterFunction]. The setter triggers a re-render. State updates are asynchronous and batched.',
    code: `// Basic
const [count, setCount] = useState(0);

// Functional update (when new state depends on previous)
setCount(prev => prev + 1); // ✅ Always use this pattern

// Object state – MUST spread
const [user, setUser] = useState({ name: '', email: '' });
setUser(prev => ({ ...prev, name: 'Sriram' }));

// Lazy initialization (expensive computation only runs once)
const [data, setData] = useState(() => {
  return JSON.parse(localStorage.getItem('data'));
});

// Array state
const [items, setItems] = useState([]);
setItems(prev => [...prev, newItem]);          // add
setItems(prev => prev.filter(i => i.id !== id)); // remove
setItems(prev => prev.map(i => i.id === id ? {...i, done: true} : i)); // update`,
    warning: 'Never mutate state directly! user.name = \'X\' won\'t trigger re-render. Always use the setter with a new reference.',
  },
  {
    id: 'rh3',
    question: 'useEffect – Lifecycle and dependency array explained',
    difficulty: 'intermediate',
    simple: 'useEffect runs side effects after render. The dependency array controls WHEN it runs. Return a cleanup function for subscriptions/timers.',
    code: `// 1. No deps = runs after EVERY render
useEffect(() => { document.title = \`Count: \${count}\`; });

// 2. Empty [] = runs ONCE on mount (like componentDidMount)
useEffect(() => {
  const sub = api.subscribe(handler);
  return () => sub.unsubscribe(); // cleanup on unmount
}, []);

// 3. With deps = runs when dependencies change
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]); // re-runs when userId changes

// 4. Cleanup prevents memory leaks
useEffect(() => {
  const handler = () => setWidth(window.innerWidth);
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);`,
    tip: 'In interviews, always mention cleanup functions. Common follow-up: "What happens without cleanup?" → Memory leaks, stale subscriptions, event handlers piling up.',
  },
  {
    id: 'rh4',
    question: 'useContext – How to avoid prop drilling?',
    difficulty: 'intermediate',
    simple: 'useContext reads a context value without prop drilling. Create context → Provide it → Consume it anywhere in the tree.',
    code: `// 1. Create
const AuthContext = createContext(null);

// 2. Provide (wrap in parent)
function App() {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Dashboard />
    </AuthContext.Provider>
  );
}

// 3. Consume (use anywhere deep in tree)
function UserProfile() {
  const { user } = useContext(AuthContext);
  return <h1>Welcome, {user?.name}</h1>;
}

// Pro pattern: Custom hook for cleaner API
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be within AuthProvider');
  return context;
}`,
    warning: 'Context causes ALL consumers to re-render when the value changes. For frequent updates, consider splitting contexts or using state management libraries.',
  },
  {
    id: 'rh5',
    question: 'useReducer – When to use instead of useState?',
    difficulty: 'intermediate',
    simple: 'Use useReducer when state logic is complex – multiple related values, state transitions depend on previous state, or actions are distinct operations (like Redux pattern).',
    code: `const initialState = { items: [], loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START': return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR': return { ...state, loading: false, error: action.payload };
    case 'ADD_ITEM': return { ...state, items: [...state.items, action.payload] };
    case 'DELETE_ITEM': return { ...state, items: state.items.filter(i => i.id !== action.payload) };
    default: return state;
  }
}

function TodoApp() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchTodos = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await api.getTodos();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  };
}`,
  },
  {
    id: 'rh6',
    question: 'useMemo vs useCallback – Performance hooks explained',
    difficulty: 'intermediate',
    simple: 'useMemo caches a computed value. useCallback caches a function reference. Both re-compute only when dependencies change.',
    table: {
      headers: ['Hook', 'Caches', 'Use When'],
      rows: [
        ['useMemo', 'Computed value', 'Expensive calculations (sorting, filtering)'],
        ['useCallback', 'Function reference', 'Passing callbacks to memoized children'],
      ],
    },
    code: `// useMemo – expensive filter only recalculates when deps change
const filtered = useMemo(() => {
  return items.filter(i => i.name.includes(search)).sort((a,b) => a.price - b.price);
}, [items, search]);

// useCallback – stable function reference
const handleDelete = useCallback((id) => {
  setItems(prev => prev.filter(i => i.id !== id));
}, []);

// useCallback is essentially: useMemo(() => fn, deps)

// When NOT to use:
// - Simple calculations (overhead of memoization > recalculation)
// - Values not passed to memoized children`,
  },
  {
    id: 'rh7',
    question: 'useRef – DOM access and mutable values',
    difficulty: 'intermediate',
    simple: 'useRef returns a mutable object (.current) that persists across renders WITHOUT causing re-renders. Two uses: (1) DOM element access, (2) storing mutable values like timers.',
    code: `// 1. DOM Access
function FocusInput() {
  const inputRef = useRef(null);
  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  );
}

// 2. Mutable value (doesn't trigger re-render)
function Timer() {
  const intervalRef = useRef(null);
  const [count, setCount] = useState(0);

  const start = () => {
    intervalRef.current = setInterval(() => setCount(c => c + 1), 1000);
  };
  const stop = () => clearInterval(intervalRef.current);

  return <><span>{count}</span><button onClick={start}>Start</button><button onClick={stop}>Stop</button></>;
}

// 3. Previous value tracking
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}`,
  },
  {
    id: 'rh8',
    question: 'Custom Hooks – How to extract and reuse logic?',
    difficulty: 'intermediate',
    simple: 'Custom hooks are JS functions starting with "use" that encapsulate reusable stateful logic. They can call other hooks. Each component using a custom hook gets its own independent state.',
    code: `// useDebounce – delays value updates
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// useFetch – data fetching with loading/error states
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    const ctrl = new AbortController();
    setState(s => ({ ...s, loading: true }));
    fetch(url, { signal: ctrl.signal })
      .then(r => r.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(error => {
        if (error.name !== 'AbortError')
          setState({ data: null, loading: false, error });
      });
    return () => ctrl.abort();
  }, [url]);

  return state;
}

// Usage
function UserList() {
  const { data, loading, error } = useFetch('/api/users');
  if (loading) return <Spinner />;
  if (error) return <Error msg={error.message} />;
  return data.map(u => <UserCard key={u.id} user={u} />);
}`,
    tip: 'In your CIA Retail Analysis project, you used custom hooks for WebSocket connection management and heatmap data processing – mention this as a real-world custom hook example.',
  },
];

export default reactHooks;
