const reactPerformance = [
  {
    id: 'rpf1',
    question: 'What triggers a re-render? How to prevent unnecessary renders?',
    difficulty: 'advanced',
    simple: 'Re-renders happen when: (1) state changes, (2) props change, (3) parent re-renders, (4) context changes. Prevent unnecessary renders with React.memo, useMemo, useCallback, and proper state structure.',
    code: `// React.memo – skip re-render if props haven't changed
const ExpensiveList = React.memo(function List({ items }) {
  return items.map(i => <div key={i.id}>{i.name}</div>);
});

// Combine with useCallback for callbacks
function Parent() {
  const [count, setCount] = useState(0);
  const handleClick = useCallback((id) => {
    // stable reference – ExpensiveList won't re-render
  }, []);
  return <>
    <p>{count}</p>
    <ExpensiveList items={items} onClick={handleClick} />
  </>;
}

// Move state down – only affected component re-renders
// ❌ Bad: count state in App re-renders everything
// ✅ Good: count state in Counter, only Counter re-renders`,
  },
  {
    id: 'rpf2',
    question: 'Virtualization for large lists (react-window)',
    difficulty: 'advanced',
    simple: 'Virtualization only renders items visible in the viewport. For a 10,000 item list, maybe 20 DOM nodes exist at once. Libraries: react-window or @tanstack/react-virtual.',
    code: `import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList height={500} itemCount={items.length} itemSize={50} width="100%">
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
// 10,000 items but only ~10 DOM nodes at any time!`,
    tip: 'In the CIA dashboard, you displayed eye-tracking data with hundreds of data points – virtualization would be relevant here. Mention it!',
  },
  {
    id: 'rpf3',
    question: 'React DevTools Profiler – How to measure performance?',
    difficulty: 'advanced',
    simple: 'React DevTools Profiler records render timings. It shows which components rendered, why, and how long each took. Use it to identify bottlenecks and verify optimizations work.',
    points: [
      { bold: 'Flamegraph view', text: 'shows render time per component' },
      { bold: '"Why did this render?"', text: 'toggle in settings' },
      { bold: 'Highlight updates', text: 'visually see which components re-render' },
      { bold: 'Look for:', text: 'components rendering too often, unnecessary parent re-renders' },
    ],
    code: `// Programmatic profiling
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log(\`\${id} \${phase}: \${actualDuration}ms\`);
}

<Profiler id="Dashboard" onRender={onRenderCallback}>
  <Dashboard />
  </Profiler>`,
  },
  {
    id: 'rpf4',
    question: 'How will you optimize the applications? What are the steps to optimize?',
    difficulty: 'expert',
    simple: 'Optimization is a multi-step process involving profiling, code-splitting, rendering optimization, and asset optimization.',
    points: [
      { bold: '1. Profiling first', text: 'Never guess. Use React DevTools Profiler, Chrome Lighthouse, and Network tab to identify real bottlenecks before optimizing.' },
      { bold: '2. Render Optimization', text: 'Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders. Keep state as local as possible.' },
      { bold: '3. Code Splitting', text: 'Use React.lazy() and Suspense to split large bundles and load routes or components only when they are needed.' },
      { bold: '4. Asset & Network Optimization', text: 'Optimize images (WebP), lazy load offscreen images, and use CDNs. Memoize API calls using tools like React Query, SWR, or Apollo.' },
      { bold: '5. Virtualization', text: 'Use react-window or react-virtualized for rendering large lists instead of rendering thousands of DOM nodes.' }
    ],
  },
  {
    id: 'rpf5',
    question: 'How will you handle large scale applications?',
    difficulty: 'expert',
    simple: 'Handling large-scale applications requires strong architectural decisions, efficient state management, and strict coding standards to ensure maintainability and performance.',
    table: {
      headers: ['Aspect', 'Strategy for Scale'],
      rows: [
        ['Architecture', 'Feature-based folder structure (Domain-Driven Design) or Micro-frontends. Absolute imports.'],
        ['State Management', 'Separate server state (React Query/RTK Query) from client state (Zustand/Redux). Minimize global state.'],
        ['Performance', 'Implement strict code-splitting by route, asset optimization, and virtualization for data grids.'],
        ['Testing', 'Comprehensive testing pyramid: Unit tests (Jest/Vitest), Integration tests (Testing Library), E2E (Cypress/Playwright).'],
        ['CI/CD & Tooling', 'Automated linting (ESLint), formatting (Prettier), type checking (TypeScript), and strict PR review processes with Husky hooks.']
      ]
    }
  }
];

export default reactPerformance;
