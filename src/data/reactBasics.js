const reactBasics = [
  {
    id: 'rb1',
    question: 'What is React and why use it?',
    difficulty: 'basics',
    simple: 'React is a JavaScript library by Meta for building user interfaces using reusable components. It uses a Virtual DOM to efficiently update the UI without touching the real DOM directly.',
    detailed: [
      'React is an open-source, declarative, component-based library. It follows unidirectional data flow (props flow down, events bubble up). Key reasons to choose React:',
    ],
    points: [
      { bold: 'Component Architecture', text: 'Build encapsulated, reusable UI blocks' },
      { bold: 'Virtual DOM', text: 'Minimizes expensive real DOM operations via diffing' },
      { bold: 'Rich Ecosystem', text: 'React Router, Redux, Next.js, React Query' },
      { bold: 'Strong Community', text: 'Massive npm packages, job market, and Meta backing' },
      { bold: 'Cross-Platform', text: 'React Native for mobile, Electron for desktop' },
    ],
    code: `import { createRoot } from 'react-dom/client';

function App() {
  return <h1>Hello, React!</h1>;
}

createRoot(document.getElementById('root')).render(<App />);`,
    tip: 'Mention your 3 years of MERN experience and how React\'s component model helped you build the CIA Retail Analysis dashboard with reusable chart components.',
  },
  {
    id: 'rb2',
    question: 'What is JSX? Is it mandatory?',
    difficulty: 'basics',
    simple: 'JSX is a syntax extension that lets you write HTML-like code inside JavaScript. It\'s NOT mandatory – you can use React.createElement() instead – but JSX is much more readable.',
    detailed: ['JSX gets transpiled by Babel into React.createElement() calls. Key rules:'],
    points: [
      { bold: 'className', text: 'Use className instead of class' },
      { bold: 'htmlFor', text: 'Use htmlFor instead of for' },
      { bold: 'Single parent', text: 'Must return a single parent element (use Fragments <>...</>)' },
      { bold: 'JS expressions', text: 'Embed JS expressions with curly braces {}' },
      { bold: 'Self-close', text: 'Self-close tags like <img />' },
    ],
    code: `// JSX version (readable)
const element = <h1 className="title">Hello, {name}!</h1>;

// Without JSX (what Babel compiles to)
const element = React.createElement('h1',
  { className: 'title' },
  \`Hello, \${name}!\`
);

// Conditional rendering in JSX
const Greeting = ({ isLoggedIn }) => (
  isLoggedIn ? <h1>Welcome back!</h1> : <h1>Please sign in</h1>
);`,
  },
  {
    id: 'rb3',
    question: 'What is the Virtual DOM and how does it work?',
    difficulty: 'basics',
    simple: 'The Virtual DOM is a lightweight JavaScript copy of the real DOM. When state changes, React creates a new VDOM, compares it with the old one (diffing), and updates only the changed parts in the real DOM (reconciliation).',
    detailed: [],
    points: [
      { bold: 'Step 1:', text: 'State/props change triggers a re-render' },
      { bold: 'Step 2:', text: 'React creates a new Virtual DOM tree' },
      { bold: 'Step 3:', text: 'React diffs (compares) new VDOM vs old VDOM' },
      { bold: 'Step 4:', text: 'Calculates minimal set of changes needed' },
      { bold: 'Step 5:', text: 'Batch-applies those changes to the real DOM' },
    ],
    afterPoints: 'This is much faster than directly manipulating the DOM because DOM operations are expensive (layout reflow, repaint).',
    code: `// Only the <span> with count updates, not the entire component
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Counter App</h1>  {/* NOT re-rendered in DOM */}
      <span>Count: {count}</span>  {/* Only THIS updates */}
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`,
  },
  {
    id: 'rb4',
    question: 'What is the difference between State and Props?',
    difficulty: 'basics',
    simple: 'Props are data passed FROM parent TO child (read-only). State is data managed WITHIN the component itself (mutable via setState). Both trigger re-renders when changed.',
    table: {
      headers: ['Aspect', 'Props', 'State'],
      rows: [
        ['Source', 'Parent component', 'Component itself'],
        ['Mutability', 'Read-only (immutable)', 'Mutable via setter'],
        ['Purpose', 'Configure child', 'Internal data management'],
        ['Re-render trigger', 'Parent re-renders', 'setState / setter called'],
      ],
    },
    code: `// Props – passed from parent, child cannot modify
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}
// <Welcome name="Sriram" />  ← parent controls this

// State – component's own mutable data
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
  },
  {
    id: 'rb5',
    question: 'Functional Components vs Class Components',
    difficulty: 'basics',
    simple: 'Functional components are plain JS functions that return JSX. Class components use ES6 classes with a render() method. Modern React uses functional components + Hooks exclusively.',
    table: {
      headers: ['Feature', 'Functional', 'Class'],
      rows: [
        ['Syntax', 'Function + return JSX', 'class extends React.Component'],
        ['State', 'useState hook', 'this.state + this.setState'],
        ['Lifecycle', 'useEffect hook', 'componentDidMount, etc.'],
        ['Performance', 'Slightly better (no class overhead)', 'Extra memory for `this` binding'],
        ['Modern usage', '✅ Recommended', '❌ Legacy only'],
      ],
    },
    code: `// ✅ Functional (modern)
function Greeting({ name }) {
  const [count, setCount] = useState(0);
  useEffect(() => { document.title = name; }, [name]);
  return <div>Hello, {name}! Count: {count}</div>;
}

// ❌ Class (legacy)
class Greeting extends React.Component {
  state = { count: 0 };
  componentDidMount() { document.title = this.props.name; }
  render() { return <div>Hello, {this.props.name}!</div>; }
}`,
  },
  {
    id: 'rb6',
    question: 'Why are Keys important in React lists?',
    difficulty: 'basics',
    simple: 'Keys give React a stable identity for each list item so it can efficiently reorder, add, or remove items without re-rendering the entire list.',
    points: [
      { bold: 'Unique among siblings', text: 'Keys must be unique among siblings (not globally)' },
      { bold: 'Use stable IDs', text: 'Use stable IDs, NOT array indices (indices cause bugs on reorder)' },
      { bold: 'Reconciliation', text: 'Keys help React\'s reconciliation algorithm identify which items changed' },
      { bold: 'Performance', text: 'Without keys: entire list re-renders. With keys: only changed items update' },
    ],
    code: `// ✅ Good: stable unique ID
{users.map(user => (
  <li key={user.id}>{user.name}</li>
))}

// ❌ Bad: array index (breaks on sort/filter/delete)
{users.map((user, index) => (
  <li key={index}>{user.name}</li>
))}`,
    warning: 'Using index as key is acceptable ONLY for static lists that never change order.',
  },
  {
    id: 'rb7',
    question: 'How do you handle events in React?',
    difficulty: 'basics',
    simple: 'React uses Synthetic Events – a cross-browser wrapper around native events. You pass event handlers as camelCase props like onClick, onChange, onSubmit.',
    code: `function Form() {
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    console.log('Submitted!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={(e) => console.log(e.target.value)} />
      <button onClick={() => alert('Clicked!')}>Click</button>
      <button type="submit">Submit</button>
    </form>
  );
}
// Common: onClick, onChange, onSubmit, onFocus, onBlur, onKeyDown`,
  },
  {
    id: 'rb8',
    question: 'What is Conditional Rendering?',
    difficulty: 'basics',
    simple: 'Showing different UI based on conditions. In React, use ternary operators, logical AND (&&), or early returns.',
    code: `// 1. Ternary
{isLoggedIn ? <Dashboard /> : <Login />}

// 2. Logical AND (render only if true)
{error && <ErrorMessage msg={error} />}

// 3. Early return
function Page({ user }) {
  if (!user) return <LoginPrompt />;
  return <Dashboard user={user} />;
}

// 4. Switch-like with object mapping
const statusComponent = {
  loading: <Spinner />,
  error: <Error />,
  success: <Data />
};
return statusComponent[status] || null;`,
  },
  {
    id: 'rb9',
    question: 'What is Lifting State Up?',
    difficulty: 'basics',
    simple: 'When two sibling components need to share data, move the state to their closest common parent. The parent passes state down as props and update functions as callbacks.',
    code: `// Parent holds the shared state
function Parent() {
  const [temp, setTemp] = useState('');
  return (
    <>
      <Input value={temp} onChange={setTemp} />
      <Display value={temp} />
    </>
  );
}

function Input({ value, onChange }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}

function Display({ value }) {
  return <p>Temperature: {value}</p>;
}`,
    tip: 'When the interviewer asks about prop drilling vs lifting state, mention that for deeply nested trees you\'d use Context API or state management libraries like Redux/Zustand.',
  },
  {
    id: 'rb10',
    question: 'What are React Fragments?',
    difficulty: 'basics',
    simple: 'Fragments let you group multiple elements without adding an extra DOM node. Use <>...</> shorthand or <React.Fragment> (when you need a key).',
    code: `// Without Fragment: extra div pollution
return <div><td>A</td><td>B</td></div>; // ❌ invalid HTML

// With Fragment: clean DOM
return <><td>A</td><td>B</td></>; // ✅

// Keyed Fragment (for lists)
{items.map(item => (
  <React.Fragment key={item.id}>
    <dt>{item.term}</dt>
    <dd>{item.definition}</dd>
  </React.Fragment>
))}`,
  },
  {
    id: 'rb11',
    question: 'What is Component Composition?',
    difficulty: 'basics',
    simple: 'Building complex UI by combining smaller components. Use children prop and named slots instead of inheritance.',
    code: `// Composition via children
function Card({ children }) {
  return <div className="card">{children}</div>;
}

// Named slots
function Layout({ header, sidebar, content }) {
  return (
    <div className="layout">
      <header>{header}</header>
      <aside>{sidebar}</aside>
      <main>{content}</main>
    </div>
  );
}

// Usage
<Layout
  header={<NavBar />}
  sidebar={<FilterPanel />}
  content={<ProductList />}
/>`,
    tip: 'React favors composition over inheritance. This is a key design principle – mention it when discussing component architecture.',
  },
];

export default reactBasics;
