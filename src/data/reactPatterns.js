const reactPatterns = [
  {
    id: 'rp1',
    question: 'Higher-Order Components (HOC) pattern',
    difficulty: 'intermediate',
    simple: 'A HOC is a function that takes a component and returns a new enhanced component. It\'s a pattern for reusing cross-cutting logic like auth checks, loading states, or analytics.',
    code: `function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}
const ProtectedDashboard = withAuth(Dashboard);

// Modern alternative: Custom hooks replace most HOC needs
function Dashboard() {
  const { user } = useAuth(); // Custom hook instead of HOC
  if (!user) return <Navigate to="/login" />;
  return <div>Welcome {user.name}</div>;
}`,
  },
  {
    id: 'rp2',
    question: 'Controlled vs Uncontrolled Components',
    difficulty: 'intermediate',
    simple: 'Controlled = React state drives the input value. Uncontrolled = DOM manages the value; you read it via ref. Controlled gives you full control; uncontrolled is simpler for basic forms.',
    code: `// Controlled – React is the "single source of truth"
function ControlledForm() {
  const [email, setEmail] = useState('');
  return <input value={email} onChange={e => setEmail(e.target.value)} />;
}

// Uncontrolled – DOM manages the value
function UncontrolledForm() {
  const emailRef = useRef();
  const handleSubmit = () => console.log(emailRef.current.value);
  return <input ref={emailRef} defaultValue="test@mail.com" />;
}

// When to use which?
// Controlled: validation, dynamic UI, conditional disabling
// Uncontrolled: file inputs, simple forms, integrating non-React code`,
  },
  {
    id: 'rp3',
    question: 'React Portals – Rendering outside the DOM tree',
    difficulty: 'intermediate',
    simple: 'Portals let you render a component\'s output into a different DOM node (like document.body), while keeping it in the React component tree for events. Perfect for modals, tooltips, dropdowns.',
    code: `import { createPortal } from 'react-dom';

function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.getElementById('modal-root') // renders here in DOM
  );
  // But events still bubble through React's component tree!
}`,
  },
  {
    id: 'rp4',
    question: 'State Management: Redux vs Zustand vs Context vs React Query',
    difficulty: 'expert',
    simple: 'Choose based on complexity: Context for simple shared state, Zustand for lightweight global state, Redux Toolkit for complex apps with middleware, React Query for server state (API data).',
    table: {
      headers: ['Solution', 'Best For', 'Bundle Size'],
      rows: [
        ['Context + useReducer', 'Simple theme/auth', '0 KB (built-in)'],
        ['Zustand', 'Simple global state', '~1 KB'],
        ['Redux Toolkit', 'Complex enterprise apps', '~11 KB'],
        ['React Query', 'Server state / API caching', '~13 KB'],
        ['Jotai', 'Atomic fine-grained reactivity', '~3 KB'],
      ],
    },
    code: `// Zustand – minimal boilerplate
import { create } from 'zustand';
const useStore = create((set) => ({
  count: 0,
  increment: () => set(s => ({ count: s.count + 1 })),
}));
function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}

// Redux Toolkit – scalable
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; }, // Immer handles immutability
  }
});`,
    tip: 'When asked "Which do you prefer?", say: "I choose based on project needs. For the Spinz app I used Context for auth + React Query for API data. For the CIA dashboard with complex real-time state, I\'d consider Redux Toolkit or Zustand."',
  },
];

export default reactPatterns;
