const scenarioBased = [
  {
    id: 'sb1',
    question: 'App slowed down after new features — how do you find and fix it?',
    difficulty: 'advanced',
    simple: 'Symptoms: slow typing, scroll jank, sluggish route changes, high CPU. Process: Measure with DevTools → Identify hot components → Apply targeted fixes (memoization, virtualization, code splitting) → Verify with Profiler.',
    detailed: ['Step-by-step diagnosis approach:'],
    points: [
      { bold: 'Performance Panel (Chrome DevTools)', text: 'Record → look for long tasks (>50ms), scripting spikes, layout thrash. This tells you WHERE the slowness is.' },
      { bold: 'React DevTools Profiler', text: 'Identify "hot" components by render time and render count. Use "Why did this render?" to trace prop/state changes.' },
      { bold: 'Coverage Tab', text: 'Find unused JS/CSS bloat that adds to parse time without being used.' },
      { bold: 'Network Tab', text: 'Spot large bundles, request waterfalls, and N+1 API calls that block rendering.' },
    ],
    afterPoints: 'Fix Patterns: Stop unnecessary re-renders with React.memo, useCallback, useMemo. Virtualize long lists with react-window. Code-split heavy routes with React.lazy + Suspense. Keep local state local — avoid global store re-rendering entire trees. Avoid inline objects/arrays in JSX (hoist or memoize them).',
    code: `// Stop re-renders
const Row = React.memo(({ item, onSelect }) => <li onClick={() => onSelect(item.id)}>{item.name}</li>);
const onSelect = useCallback((id) => setSelected(id), []);
const filtered = useMemo(() => heavyFilter(items, query), [items, query]);

// Virtualize large lists
import { FixedSizeList as List } from 'react-window';
<List height={600} itemCount={rows.length} itemSize={48} width="100%">
  {({ index, style }) => <Row style={style} item={rows[index]} />}
</List>

// Code split heavy routes
const Analytics = React.lazy(() => import('./Analytics'));
<Route path="/analytics" element={
  <Suspense fallback={<Spinner />}>
    <Analytics />
  </Suspense>
} />`,
    tip: 'Interview tip: Walk through measure → identify → act → verify. Mention a real before/after metric: "LCP dropped from 5.3s to 2.2s after virtualizing the list and lazy loading the chart library."',
  },
  {
    id: 'sb2',
    question: 'How do you block the login page after authentication (guarded routes)?',
    difficulty: 'intermediate',
    simple: 'Create two route guards: PrivateRoute (redirects unauthenticated users to /login) and PublicOnlyRoute (redirects already-authenticated users away from /login to /dashboard). Store auth state centrally in Context or Redux.',
    detailed: ['The full solution requires:'],
    points: [
      { bold: 'Central auth state', text: 'Use AuthContext or Redux to hold { user, loading }. This is the single source of truth for auth status.' },
      { bold: 'PrivateRoute wrapper', text: 'Shows a spinner during auth check, redirects to /login if unauthenticated, renders children if auth passes.' },
      { bold: 'PublicOnlyRoute wrapper', text: 'Redirects authenticated users AWAY from /login to /dashboard. Prevents the back-button re-login issue.' },
      { bold: 'Auth bootstrap loader', text: 'On page refresh, auth is async. Show a full-page loader until auth resolves to prevent a "flash" of the wrong page.' },
    ],
    code: `// Auth context
const AuthContext = React.createContext({ user: null, loading: true });
export const useAuth = () => useContext(AuthContext);

// PrivateRoute — blocks unauthenticated access
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return user ? children : <Navigate to="/login" replace />;
}

// PublicOnlyRoute — blocks authenticated users from hitting /login
function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageSpinner />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

// Routes setup (React Router v6)
<Routes>
  <Route path="/login"      element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
  <Route path="/dashboard"  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
  <Route path="/profile"    element={<PrivateRoute><Profile /></PrivateRoute>} />
</Routes>`,
    warning: 'Pitfalls: Race condition on page refresh (show loading until auth resolves). Flash of /login before redirect (gate rendering until auth state is determined). Always use replace in Navigate to prevent broken back-button behavior.',
  },
  {
    id: 'sb3',
    question: 'How do you handle graceful API error handling for a resilient UX?',
    difficulty: 'intermediate',
    simple: 'Detect and categorize errors (network/4xx/5xx/timeout), show actionable UI (not just "Something went wrong"), offer retry buttons, use React Query/SWR for automatic retries with backoff, and always implement an Error Boundary for uncaught render errors.',
    points: [
      { bold: 'Detect & categorize', text: 'Network errors, 400 Bad Request (user errors), 401 Unauthorized (redirect to login), 403 Forbidden (show locked UI), 500 Server Errors (show retry).' },
      { bold: 'React Query / SWR', text: 'Built-in retry with exponential backoff, stale-while-revalidate, automatic refetch on window focus. Eliminates most manual error state management.' },
      { bold: 'UI patterns', text: 'Toasts for transient non-blocking errors. Inline error messages for blocking form errors. Full-page error states with retry for critical data failures.' },
      { bold: 'Error Boundaries', text: 'Wrap sections of the app in Error Boundaries to catch runtime render errors and show a fallback UI instead of a blank screen.' },
      { bold: 'Observability', text: 'Log errors to Sentry with correlation IDs. Show user-safe messages, never raw stack traces.' },
    ],
    code: `// React Query with retry & backoff
const { data, error, isError, isLoading, refetch } = useQuery({
  queryKey: ['feedData'],
  queryFn: fetchFeed,
  retry: 2,
  retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000), // 1s, 2s, 4s max 8s
});

if (isLoading) return <SkeletonFeed />;
if (isError)   return <ErrorBlock msg={mapError(error)} onRetry={refetch} />;
return <Feed items={data} />;

// Error mapping function
function mapError(error) {
  if (!navigator.onLine)      return 'No internet connection. Please check your network.';
  if (error.status === 401)   return 'Session expired. Please log in again.';
  if (error.status === 403)   return 'You do not have permission to view this.';
  if (error.status >= 500)    return 'Server error. Please try again in a moment.';
  return 'Something went wrong. Please try again.';
}

// Error Boundary (class component or react-error-boundary library)
<ErrorBoundary fallback={<ErrorPage />}>
  <Suspense fallback={<Skeleton />}>
    <Dashboard />
  </Suspense>
</ErrorBoundary>`,
  },
  {
    id: 'sb4',
    question: 'How do you eliminate duplicate fetching and N+1 API calls?',
    difficulty: 'advanced',
    simple: 'Use React Query or SWR as a single cache layer — identical query keys share the same cached data. Lift fetches to a common parent/provider. Batch endpoints server-side. Abort stale requests with AbortController when deps change.',
    detailed: ['Common symptoms:'],
    points: [
      { bold: 'Shared cache keys', text: 'React Query/SWR deduplicates requests with the same queryKey. Multiple sibling components calling useQuery({ queryKey: [\'profile\'] }) make exactly ONE network request.' },
      { bold: 'Lift & share data', text: 'Fetch in a parent or a layout component, then pass data down. Avoids the same fetch firing in multiple children independently.' },
      { bold: 'Batching', text: 'Combine related endpoints server-side (GraphQL, BFF patterns). Debounce search inputs to avoid a request per keystroke.' },
      { bold: 'AbortController', text: 'Cancel the previous request when dependencies change (e.g., a search input). Prevents stale responses from landing in state.' },
    ],
    code: `// React Query deduplication — only ONE network request, shared by all consumers
function Navbar() {
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: getMe, staleTime: 60_000 });
  return <Avatar name={user?.name} />;
}
function Sidebar() {
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: getMe, staleTime: 60_000 });
  // NO extra network request — uses cached data ✅
  return <p>Hello, {user?.name}</p>;
}

// Debounce search to prevent N+1 calls
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 300); // Only fires after 300ms pause
const { data: results } = useQuery({
  queryKey: ['search', debouncedQuery],
  queryFn: () => searchAPI(debouncedQuery),
  enabled: debouncedQuery.length > 2,
});

// AbortController for cancellable fetch
useEffect(() => {
  const ctrl = new AbortController();
  fetch(\`/api/search?q=\${query}\`, { signal: ctrl.signal })
    .then(r => r.json()).then(setResults)
    .catch(e => { if (e.name !== 'AbortError') setError(e); });
  return () => ctrl.abort(); // Cancel stale request when query changes
}, [query]);`,
    warning: 'Pitfalls: Missing queryKey dependencies (causes stale data). Re-creating QueryClient or providers on every render (loses all cache). Not setting appropriate staleTime (causes unnecessary refetches).',
  },
  {
    id: 'sb5',
    question: 'How do you optimize bundle size and loading strategy?',
    difficulty: 'advanced',
    simple: 'Diagnose with Coverage tab and Source Map Explorer. Fix by code-splitting routes with React.lazy, using tree-shakeable named imports, replacing heavy libs (moment → dayjs), lazy-loading images, and enabling Gzip/Brotli compression.',
    detailed: ['Diagnosis tools:'],
    points: [
      { bold: 'Coverage Tab', text: 'Shows unused JS/CSS per file. If a file has >70% unused code, it\'s a good code-splitting candidate.' },
      { bold: 'Source Map Explorer / Webpack Bundle Analyzer', text: 'Visual treemap of your bundle. Reveals which libraries are largest.' },
      { bold: 'Network Tab', text: 'Look for large JS files, render-blocking resources, waterfall patterns.' },
    ],
    afterPoints: 'Tactics: Split by route & feature (React.lazy + dynamic imports). Use ESM tree-shakeable libs with named imports. Replace heavy libs (moment → date-fns/dayjs, lodash → per-method). Defer non-critical code to event handlers. Compress assets with Gzip/Brotli. Use content-hashed filenames for long-term caching.',
    code: `// Route-level code splitting
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
<Routes>
  <Route path="/dashboard" element={
    <Suspense fallback={<PageSkeleton />}><Dashboard /></Suspense>
  } />
</Routes>

// Tree-shakeable imports (don't import the entire library)
import { format, parseISO } from 'date-fns'; // ✅ Not import * from 'date-fns'
import debounce from 'lodash/debounce';        // ✅ Not import _ from 'lodash'

// Defer heavy library import to event handler
async function onExportClick() {
  const { exportToPDF } = await import('./lib/pdf-export'); // Loaded on demand
  exportToPDF(data);
}

// Lazy images
<img src="hero.webp" loading="lazy" decoding="async" alt="Hero" />`,
    tip: 'Target metrics: Main bundle <200-300KB gzipped. Fast 3G TTI <5s. Track before/after with Lighthouse CI in your pipeline.',
  },
  {
    id: 'sb6',
    question: 'How do you handle complex forms with 20+ fields?',
    difficulty: 'intermediate',
    simple: 'Use React Hook Form for performance (uncontrolled inputs minimize re-renders), Zod/Yup for schema validation, break into multi-step wizard, dynamically render fields from a config array, and use useFieldArray for dynamic lists.',
    points: [
      { bold: 'React Hook Form', text: 'Uncontrolled inputs + register() means no re-render on every keystroke. Only re-renders on validation errors or submission.' },
      { bold: 'Zod/Yup schema validation', text: 'Define validation rules as a schema, integrate with useForm({ resolver: zodResolver(schema) }). Supports async validation, cross-field rules.' },
      { bold: 'Multi-step wizard', text: 'Break into logical sections (Personal → Address → Preferences). Use useReducer for wizard state. Resume progress from localStorage.' },
      { bold: 'Dynamic field rendering', text: 'Store field config (label, type, validation) in a JSON array. Loop through to render inputs. Easy to add/remove fields without touching JSX.' },
      { bold: 'useFieldArray', text: 'Handles arrays of fields (e.g., multiple phone numbers, addresses) with add/remove/reorder built in.' },
    ],
    code: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+'),
  phone: z.string().regex(/^\d{10}$/, 'Enter 10-digit phone'),
});

function ProfileForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = async (data) => {
    await updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span className="error">{errors.email.message}</span>}

      <input {...register('age', { valueAsNumber: true })} type="number" />
      {errors.age && <span className="error">{errors.age.message}</span>}

      <button disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Submit'}
      </button>
    </form>
  );
}`,
    warning: 'Pitfall: Using controlled inputs (value + onChange) for 20+ fields causes a re-render on EVERY keystroke — massive performance hit. Use React Hook Form\'s register() (uncontrolled) instead.',
  },
  {
    id: 'sb7',
    question: 'How do you implement dark mode / theming at scale?',
    difficulty: 'intermediate',
    simple: 'Use CSS custom properties (variables) at :root, toggle a .dark class on <html>, persist preference in localStorage, and detect system preference with prefers-color-scheme. Wrap in a ThemeContext for React component access.',
    code: `/* CSS — define theme variables on :root */
:root { --bg: #ffffff; --fg: #111111; --primary: #6366f1; }
.dark  { --bg: #0b0b0b; --fg: #f3f3f3; --primary: #818cf8; }
body   { background: var(--bg); color: var(--fg); }

// ThemeProvider — context-driven theme management
const ThemeContext = React.createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Priority: localStorage → system preference → default 'light'
    return localStorage.getItem('theme')
      || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system theme changes in real-time
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

// Usage
const { theme, setTheme } = useContext(ThemeContext);
<button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
  {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
</button>`,
    points: [
      { bold: 'CSS Variables approach', text: 'Easiest, most performant — no JS re-renders needed. Just toggle a class on <html>.' },
      { bold: 'SSR hydration', text: 'For Next.js: read theme from cookie (not localStorage) to prevent flash of unstyled content (FOUC) on first load.' },
      { bold: 'Themed assets', text: 'Swap logos/images using CSS: .dark .logo { content: url(logo-dark.svg); }' },
    ],
  },
  {
    id: 'sb8',
    question: 'How do you prevent XSS attacks in a React application?',
    difficulty: 'intermediate',
    simple: 'React auto-escapes all JSX expressions by default, which prevents most XSS. The main risk comes from dangerouslySetInnerHTML — always sanitize with DOMPurify before using it. Also set strict CSP headers and use HttpOnly cookies for tokens.',
    points: [
      { bold: 'React auto-escaping', text: 'Everything in {expression} is escaped automatically. <div>{userInput}</div> even if userInput = "<script>alert(1)</script>" renders as text, not executable.' },
      { bold: 'dangerouslySetInnerHTML', text: 'The main XSS vector in React. Never use raw HTML. Always sanitize with DOMPurify first. The name is intentional — it\'s dangerous.' },
      { bold: 'Content Security Policy (CSP)', text: 'HTTP header that blocks inline scripts from running. Configure on your server: Content-Security-Policy: default-src \'self\'; script-src \'self\'' },
      { bold: 'HttpOnly cookies', text: 'Store auth tokens in HttpOnly cookies (not localStorage) so JavaScript cannot access them, preventing token theft via XSS.' },
      { bold: 'Input sanitization on backend', text: 'Never trust frontend validation alone. Validate, sanitize, and escape on the server too.' },
    ],
    code: `import DOMPurify from 'dompurify';

// ✅ Sanitize before rendering raw HTML
function SafeHTML({ html }) {
  const clean = useMemo(() => DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  }), [html]);

  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// ✅ Safe URL construction (prevent javascript: href injection)
function SafeLink({ url, children }) {
  const safeUrl = useMemo(() => {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) return '#';
      return parsed.href;
    } catch { return '#'; }
  }, [url]);
  return <a href={safeUrl}>{children}</a>;
}

// ❌ Never do this with untrusted input
<div dangerouslySetInnerHTML={{ __html: userContent }} /> // XSS risk!`,
  },
  {
    id: 'sb9',
    question: 'How do you implement global loading UX with skeletons?',
    difficulty: 'intermediate',
    simple: 'Use per-query loading states from React Query. Show skeleton screens (not just spinners) for content placeholders. For app-wide loading (route transitions), use a global loading bar like NProgress with a request counter.',
    points: [
      { bold: 'Skeleton screens', text: 'Show a placeholder matching the shape of the content to load. Much better UX than spinners — reduces perceived load time.' },
      { bold: 'Per-query loading', text: 'React Query\'s isLoading/isFetching gives fine-grained loading states per data unit. Show skeleton for each independent data section.' },
      { bold: 'Global loading bar', text: 'NProgress-style thin top bar for route transitions or background syncs. Use a request counter in a LoadingContext: increment on start, decrement on complete.' },
      { bold: 'Suspense boundaries', text: 'Wrap lazy sections in <Suspense fallback={<Skeleton/>}> to show skeleton while the component chunk loads.' },
    ],
    code: `// Per-query skeleton
function ProductCard() {
  const { data, isLoading } = useQuery({ queryKey: ['product', id], queryFn: fetchProduct });
  if (isLoading) return <CardSkeleton />;  // Matches card shape
  return <Card data={data} />;
}

// Skeleton component
function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
    </div>
  );
}

// Global loading bar (NProgress)
const [loadingCount, setLoadingCount] = useState(0);
const startLoading = () => setLoadingCount(n => n + 1);
const stopLoading  = () => setLoadingCount(n => Math.max(0, n - 1));
useEffect(() => {
  if (loadingCount > 0) NProgress.start();
  else NProgress.done();
}, [loadingCount]);`,
    warning: 'Pitfall: Never leave the app stuck on an infinite spinner when a request fails. Error state must always lead to an actionable message + retry button. Spinner without error handling = dead end UX.',
  },
  {
    id: 'sb10',
    question: 'How do you make your app work on slow networks and low-end devices?',
    difficulty: 'advanced',
    simple: 'Set a performance budget (<1MB gzipped on first load). Optimize images with WebP/AVIF, responsive srcset, and lazy loading. Code-split JS by route. Use a service worker for offline caching. Track LCP/CLS/INP with Lighthouse CI.',
    detailed: ['Performance budget: <1MB total gzipped on first load, minimal main-thread work, all images optimized.'],
    points: [
      { bold: 'Images', text: 'Use WebP/AVIF format, responsive srcset + sizes, lazy loading (loading="lazy"), blur-up placeholder technique (LQIP).' },
      { bold: 'JavaScript', text: 'Route-level code splitting, avoid heavy polyfills for modern APIs, use module/nomodule patterns for legacy support.' },
      { bold: 'CSS', text: 'Inline critical CSS for above-the-fold content. Defer the rest. Avoid large CSS frameworks if 80% goes unused.' },
      { bold: 'Caching', text: 'Service worker (Workbox) for offline shell + pre-cached assets. HTTP caching with immutable content-hashed filenames.' },
      { bold: 'Data', text: 'Prefetch data on hover (React Query prefetchQuery). Compress JSON with Brotli/GZIP. Use SWR stale-while-revalidate for instant perceived loads.' },
    ],
    code: `<!-- Responsive images with WebP and lazy loading -->
<img
  src="hero-800.webp"
  srcset="hero-400.webp 400w, hero-800.webp 800w, hero-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1024px) 800px, 1200px"
  loading="lazy"
  decoding="async"
  alt="Hero image"
/>

// Prefetch on hover for instant navigation feel
function NavLink({ to, prefetchFn, children }) {
  const queryClient = useQueryClient();
  return (
    <Link
      to={to}
      onMouseEnter={() => queryClient.prefetchQuery({
        queryKey: ['page-data', to],
        queryFn: prefetchFn,
      })}
    >
      {children}
    </Link>
  );
}

// Service Worker (Workbox) - vite-plugin-pwa setup
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa';
export default { plugins: [VitePWA({ registerType: 'autoUpdate' })] };`,
    tip: 'Validation: Run Lighthouse/PageSpeed CI on every PR. Track LCP (<2.5s), CLS (<0.1), INP (<200ms), JS bytes, and image bytes on a mid-tier Android device for realistic results.',
  },
  {
    id: 'sb11',
    question: 'How do you solve caching issues in production?',
    difficulty: 'intermediate',
    simple: 'Static assets get content-hashed filenames (main.abc123.js) for long-term caching. Dynamic API responses use short Cache-Control or no-cache. Service workers need explicit update logic. CDN invalidation on deploy.',
    points: [
      { bold: 'Cache Busting (content hashing)', text: 'Vite and Create React App do this automatically. Each deploy produces a new hash, forcing browsers to fetch the latest file.' },
      { bold: 'HTTP Cache Headers', text: 'Static assets: Cache-Control: public, max-age=31536000, immutable. Dynamic API: Cache-Control: no-cache, must-revalidate.' },
      { bold: 'Service Worker Updates', text: 'When a new build deploys, the old service worker continues serving the old cache. Prompt users to refresh when a new SW is detected.' },
      { bold: 'CDN Cache Invalidation', text: 'Purge CDN cache on deploy. AWS CloudFront: aws cloudfront create-invalidation --paths "/*". Cloudflare: purge cache via API.' },
      { bold: 'ETags & Last-Modified', text: 'Browser sends If-None-Match header. Server returns 304 Not Modified if unchanged — saves bandwidth while ensuring freshness.' },
    ],
    code: `// Service Worker update detection (with vite-plugin-pwa)
import { useRegisterSW } from 'virtual:pwa-register/react';

function PWAUpdatePrompt() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();
  if (!needRefresh) return null;
  return (
    <div className="update-banner">
      <p>New version available!</p>
      <button onClick={() => updateServiceWorker(true)}>Refresh</button>
    </div>
  );
}

// HTTP Cache Headers (Nginx config)
// Static assets — cache forever with immutable
location ~* \\.(js|css|png|jpg|webp|woff2)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
// HTML — never cache (always fetch latest)
location / {
  add_header Cache-Control "no-cache, no-store, must-revalidate";
}`,
  },
];

export default scenarioBased;
