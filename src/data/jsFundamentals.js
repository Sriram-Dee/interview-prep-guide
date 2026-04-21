const jsFundamentals = [
  {
    id: 'js1',
    question: 'What are Closures? Why do they matter in React?',
    difficulty: 'intermediate',
    simple: 'A closure is a function that remembers variables from its outer scope even after the outer function has finished. In React, every event handler is a closure over the component\'s state and props at render time.',
    code: `// Closure example
function createCounter() {
  let count = 0; // enclosed variable
  return {
    increment: () => ++count,
    getCount: () => count
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2

// React stale closure problem
function Timer() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1); // ❌ Stale! Always reads initial count (0)
      setCount(c => c + 1); // ✅ Functional update avoids stale closure
    }, 1000);
    return () => clearInterval(id);
  }, []); // count is captured at mount time
}`,
  },
  {
    id: 'js2',
    question: 'Promises, async/await, and error handling',
    difficulty: 'intermediate',
    simple: 'Promises represent future values. async/await is syntactic sugar for cleaner promise chains. Always handle errors with try/catch or .catch().',
    code: `// Promise chain
fetchUser(id)
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(err => console.error(err));

// async/await (cleaner)
async function loadUserData(id) {
  try {
    const user = await fetchUser(id);
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

// Parallel execution
const [users, posts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
]);`,
  },
  {
    id: 'js3',
    question: 'Event Loop – How does JavaScript handle async code?',
    difficulty: 'advanced',
    simple: 'JS is single-threaded. The Event Loop checks: (1) Call Stack empty? → (2) Run all Microtasks (Promises) → (3) Run one Macrotask (setTimeout) → repeat.',
    code: `console.log('1');               // Sync → Call Stack
setTimeout(() => console.log('2'), 0); // Macrotask → Task Queue
Promise.resolve().then(() => console.log('3')); // Microtask → Priority!
console.log('4');               // Sync → Call Stack

// Output: 1, 4, 3, 2
// Why? Microtasks (Promises) run BEFORE macrotasks (setTimeout)`,
  },
  {
    id: 'js4',
    question: 'Essential ES6+ features used in React daily',
    difficulty: 'basics',
    simple: 'Destructuring, spread/rest, arrow functions, template literals, optional chaining, nullish coalescing, and array methods (map, filter, reduce).',
    code: `// Destructuring
const { name, age, ...rest } = props;
const [first, ...remaining] = array;

// Spread
const newUser = { ...user, name: 'Updated' };
const combined = [...arr1, ...arr2];

// Optional chaining + nullish coalescing
const city = user?.address?.city ?? 'Unknown';

// Array methods (used constantly in React)
const active = users.filter(u => u.isActive);
const names = users.map(u => u.name);
const total = cart.reduce((sum, item) => sum + item.price, 0);

// Short-circuit evaluation
const display = isLoading && <Spinner />;
const value = inputValue || 'default';`,
  },
  {
    id: 'js5',
    question: 'The "this" keyword and arrow functions',
    difficulty: 'intermediate',
    simple: '"this" depends on HOW a function is called, not where it\'s defined. Arrow functions DON\'T have their own "this" – they inherit from the enclosing scope. This is why React uses arrow functions for event handlers.',
    code: `// Regular function: \`this\` depends on caller
const obj = {
  name: 'John Doe',
  greet: function() { console.log(this.name); }, // 'John Doe'
  greetLater: function() {
    setTimeout(function() { console.log(this.name); }, 100); // undefined!
    setTimeout(() => console.log(this.name), 100); // 'John Doe' (arrow)
  }
};

// Why React uses arrow functions:
class OldComponent extends React.Component {
  handleClick = () => { this.setState({}); } // arrow = correct \`this\`
  // vs
  handleClick() { this.setState({}); } // broken unless .bind(this) in constructor
}`,
  },
  {
    id: 'js6',
    question: 'var vs let vs const – Scope and hoisting',
    difficulty: 'basics',
    simple: 'var is function-scoped and hoisted. let and const are block-scoped. const cannot be reassigned but objects can still be mutated. Always prefer const, then let. Never use var.',
    code: `// var – function scoped, hoisted
console.log(x); // undefined (hoisted)
var x = 5;

// let – block scoped, not hoisted
// console.log(y); // ❌ ReferenceError
let y = 5;

// const – block scoped, can't reassign
const z = 5;
// z = 6; // ❌ TypeError

// But objects/arrays CAN be mutated
const user = { name: 'John Doe' };
user.name = 'John'; // ✅ Works (mutation, not reassignment)

// Loop scope difference
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i)); // 3, 3, 3 (shared var)
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j)); // 0, 1, 2 (block scoped)
}`,
  },
  {
    id: 'js7',
    question: 'Prototypal Inheritance vs Class syntax',
    difficulty: 'intermediate',
    simple: 'JavaScript uses prototypal inheritance – objects inherit from other objects through the prototype chain. ES6 class syntax is just syntactic sugar over prototypes. Understanding this helps debug React class components.',
    code: `// Prototype chain
const animal = { speak() { return 'sound'; } };
const dog = Object.create(animal);
dog.bark = () => 'woof!';
dog.speak(); // 'sound' – inherited from prototype

// ES6 Class (syntactic sugar)
class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
}

class Dog extends Animal {
  bark() { return \`\${this.name} barks\`; }
}

// typeof Animal === 'function' → classes ARE functions!

// Checking prototype
dog instanceof Animal; // true
Object.getPrototypeOf(dog) === Animal.prototype; // true`,
  },
  {
    id: 'js8',
    question: 'Deep Copy vs Shallow Copy',
    difficulty: 'intermediate',
    simple: 'Shallow copy copies only the first level – nested objects still reference the same memory. Deep copy creates completely independent copies. This is critical in React state management.',
    code: `// Shallow copy methods
const original = { name: 'John Doe', address: { city: 'London' } };
const shallow1 = { ...original };
const shallow2 = Object.assign({}, original);

shallow1.address.city = 'Mumbai'; 
console.log(original.address.city); // 'Mumbai' ← SHARED reference!

// Deep copy methods
const deep1 = structuredClone(original); // ✅ Modern (Node 17+)
const deep2 = JSON.parse(JSON.stringify(original)); // ⚠️ Loses functions/dates

// In React – always create new references
setState(prev => ({
  ...prev,
  address: { ...prev.address, city: 'Mumbai' } // ✅ Proper immutable update
}));`,
  },
];

export default jsFundamentals;
