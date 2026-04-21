const reactMemoryLeaks = [
  {
    id: 'ml1',
    question: 'How do you prevent memory leaks in useEffect hooks?',
    difficulty: 'advanced',
    simple: 'Memory leaks in useEffect occur when you start an async operation (timers, subscriptions, API calls) but forget to clean it up when the component unmounts. Always return a cleanup function from useEffect.',
    detailed: ['Memory leaks in useEffect happen because:'],
    points: [
      { bold: 'Timers & intervals', text: 'setInterval / setTimeout keep running after the component is gone, holding references to component state and preventing garbage collection.' },
      { bold: 'Event listeners', text: 'Listeners attached to window or DOM elements persist in memory even after the component unmounts.' },
      { bold: 'Async/API calls', text: 'If a component unmounts while a fetch is pending, the callback tries to call setState on an unmounted component — React warns about this.' },
      { bold: 'Subscriptions', text: 'WebSocket, RxJS Observable, or external store subscriptions keep the component alive in memory.' },
    ],
    code: `// ✅ Cleanup pattern — always return a cleanup function
useEffect(() => {
  // 1. Timer cleanup
  const timer = setInterval(() => fetchData(), 5000);
  return () => clearInterval(timer);
}, []);

// ✅ Event listener cleanup
useEffect(() => {
  const onResize = () => setWidth(window.innerWidth);
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}, []);

// ✅ API call with AbortController
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(res => res.json())
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') console.error(err);
    });
  return () => controller.abort(); // Cancel on unmount
}, []);`,
    tip: 'Whiteboard checklist: Stop intervals/timeouts → Remove event listeners → Abort API calls → Unsubscribe from observables.',
  },
  {
    id: 'ml2',
    question: 'Can API calls cause memory leaks in React?',
    difficulty: 'advanced',
    simple: 'Yes. If a component unmounts before a fetch completes, the response callback still tries to call setState on the unmounted component. Use AbortController to cancel pending requests in the useEffect cleanup.',
    detailed: ['The problem occurs in two ways:'],
    points: [
      { bold: 'setState on unmounted component', text: 'React warns: "Can\'t perform a React state update on an unmounted component." The component is garbage-collected, but the async callback still holds a reference to it.' },
      { bold: 'The fix: AbortController', text: 'Create an AbortController before the fetch, pass its signal to fetch(), and call controller.abort() in the cleanup function to cancel in-flight requests.' },
      { bold: 'Ignored pattern (legacy)', text: 'An older pattern used an isMounted flag. AbortController is preferred as it also cancels the network request itself, saving bandwidth.' },
    ],
    code: `// ✅ Modern approach with AbortController
useEffect(() => {
  const controller = new AbortController();
  const signal = controller.signal;

  async function loadData() {
    try {
      const res = await fetch('/api/users', { signal });
      const data = await res.json();
      if (!signal.aborted) setUsers(data); // Extra guard
    } catch (err) {
      if (err.name === 'AbortError') return; // Silently ignore
      setError(err.message);
    }
  }

  loadData();
  return () => controller.abort(); // Cleanup: cancel if component unmounts

}, [userId]); // Re-runs when userId changes, previous request is aborted

// ❌ Old ignored pattern (still leaks — just suppresses the warning)
useEffect(() => {
  let isMounted = true;
  fetch('/api/data')
    .then(r => r.json())
    .then(data => { if (isMounted) setData(data); }); // Network still runs!
  return () => { isMounted = false; };
}, []);`,
  },
  {
    id: 'ml3',
    question: 'How do event listeners create memory leaks in React?',
    difficulty: 'intermediate',
    simple: 'Event listeners added to window, document, or DOM elements outside of React persist even after the component unmounts if not removed. Each active listener holds a reference to memory, preventing garbage collection.',
    detailed: ['Event listeners are a common source of memory leaks because:'],
    points: [
      { bold: 'Outside React\'s lifecycle', text: 'React manages component lifecycle, but window.addEventListener() is global — React has no way to auto-clean these up when a component unmounts.' },
      { bold: 'Closure retention', text: 'The listener function often closes over component state/props, keeping an entire component tree alive in memory even after it is "gone".' },
      { bold: 'Multiple mounts', text: 'In Strict Mode (dev), React mounts components twice. Without cleanup, the same listener gets registered twice, causing double-firing bugs.' },
    ],
    code: `// ✅ Always remove event listeners in cleanup
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose(); // 'onClose' captured in closure
  };
  const handleResize = () => setWidth(window.innerWidth);
  const handleScroll = () => setScrolled(window.scrollY > 100);

  document.addEventListener('keydown', handleKeyDown);
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll);

  // Cleanup: remove ALL listeners added in this effect
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
  };
}, []); // Empty deps = add on mount, remove on unmount`,
    warning: 'The cleanup function must reference the EXACT same function instance. Never do removeEventListener with an anonymous function — it won\'t match.',
  },
  {
    id: 'ml4',
    question: 'Can setInterval or setTimeout cause memory leaks?',
    difficulty: 'intermediate',
    simple: 'Yes. Timers created inside a component continue executing even after the component unmounts if not cleared. Use clearInterval() / clearTimeout() in the useEffect cleanup function.',
    code: `// ❌ Memory leak — timer runs forever after unmount
useEffect(() => {
  setInterval(() => setCount(c => c + 1), 1000); // Never cleared!
}, []);

// ✅ Fixed — clear timer on cleanup
useEffect(() => {
  const interval = setInterval(() => {
    setCount(c => c + 1);
  }, 1000);
  return () => clearInterval(interval); // Cleared on unmount
}, []);

// ✅ setTimeout also needs cleanup
useEffect(() => {
  const timeout = setTimeout(() => {
    setShowBanner(false);
  }, 5000);
  return () => clearTimeout(timeout);
}, []);

// ✅ Polling with cleanup
useEffect(() => {
  let timerId;
  const poll = async () => {
    await refreshData();
    timerId = setTimeout(poll, 3000); // Recursive polling
  };
  poll();
  return () => clearTimeout(timerId); // Stop the chain on unmount
}, []);`,
    points: [
      { bold: 'setInterval', text: 'Runs repeatedly and holds a reference to its callback (which often captures state). Use clearInterval in cleanup.' },
      { bold: 'setTimeout', text: 'One-shot but still leaks if the component unmounts before it fires. Use clearTimeout in cleanup.' },
      { bold: 'Recursive setTimeout', text: 'A common polling pattern — schedule next call at the end of the handler. Stop the chain in cleanup.' },
    ],
  },
  {
    id: 'ml5',
    question: 'Can closures or refs cause memory leaks in React?',
    difficulty: 'advanced',
    simple: 'Yes. Closures can unintentionally capture large objects or state, keeping them in memory even after the component is gone. Refs (useRef) can hold onto DOM nodes or large data that persists beyond the lifecycle — always null them out in cleanup.',
    detailed: ['Two subtle but real sources of memory leaks:'],
    points: [
      { bold: 'Closures capturing large state', text: 'A callback registered outside React (setTimeout, WebSocket, global listener) closes over component variables. Even if the component unmounts, those variables stay in memory as long as the function is referenced.' },
      { bold: 'Stale refs holding DOM nodes', text: 'ref.current holds a reference to a DOM node. If that ref is stored somewhere (a cache, a global map, a closure), the DOM node cannot be garbage collected even after the element is removed.' },
      { bold: 'Global maps or caches', text: 'Storing component instances or refs in module-level Maps/Sets without cleanup creates strong references that prevent GC.' },
    ],
    code: `// ❌ Closure leak — 'data' stays in memory
function DataTable() {
  const [data, setData] = useState(new Array(100000).fill('row'));
  useEffect(() => {
    // This closure captures 'data' array
    window.onresize = () => console.log(data.length); // LEAKS!
    return () => { window.onresize = null; }; // Fix: clean up
  }, [data]);
}

// ❌ Ref holding large data — not cleaned up
const ref = useRef(null);
useEffect(() => {
  ref.current = {
    largeData: new Array(1000000).fill('data'), // 1M items in memory
    canvas: document.getElementById('chart'),   // DOM node reference
  };
  // No cleanup — ref persists all this data after unmount!
}, []);

// ✅ Fixed — null out the ref in cleanup
useEffect(() => {
  ref.current = { largeData: computeExpensiveData() };
  return () => {
    ref.current = null; // Release all references
  };
}, []);`,
    tip: 'Use Chrome DevTools → Memory → Heap Snapshot to catch these leaks. Compare snapshots before and after mounting/unmounting a component to see if its memory is being freed.',
  },
];

export default reactMemoryLeaks;
