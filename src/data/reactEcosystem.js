const reactEcosystem = [
  {
    id: 're1',
    question: 'React Router v6 – How does routing work?',
    difficulty: 'intermediate',
    simple: 'React Router v6 uses <BrowserRouter>, <Routes>, and <Route> for client-side routing. Key hooks: useNavigate, useParams, useSearchParams, useLocation.',
    code: `import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav><Link to="/">Home</Link> | <Link to="/users">Users</Link></nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function UserDetail() {
  const { id } = useParams();       // URL params
  const navigate = useNavigate();   // programmatic navigation
  return <button onClick={() => navigate(-1)}>Back</button>;
}`,
  },
  {
    id: 're2',
    question: 'Testing React Components – RTL, Jest, user-event',
    difficulty: 'advanced',
    simple: 'Use React Testing Library (RTL) + Jest. Test behavior, not implementation. Query by role/text (what users see), not by class/id. Use userEvent for realistic interactions.',
    code: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('submits form with valid data', async () => {
  const onSubmit = jest.fn();
  render(<LoginForm onSubmit={onSubmit} />);

  await userEvent.type(screen.getByLabelText('Email'), 'test@mail.com');
  await userEvent.type(screen.getByLabelText('Password'), 'secret123');
  await userEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@mail.com', password: 'secret123'
  });
});

// Testing custom hooks
import { renderHook, act } from '@testing-library/react';
test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});`,
  },
  {
    id: 're3',
    question: 'Data Fetching – React Query / TanStack Query',
    difficulty: 'expert',
    simple: 'TanStack Query handles server state – caching, background refetching, pagination, optimistic updates. It separates server state from client state. Much better than useEffect + useState for API calls.',
    code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error msg={error.message} />;
  return data.map(u => <UserCard key={u.id} user={u} />);
}

// Mutations with cache invalidation
function CreateUser() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newUser) => fetch('/api/users', {
      method: 'POST', body: JSON.stringify(newUser)
    }),
    onSuccess: () => queryClient.invalidateQueries(['users']),
  });
}`,
  },
];

export default reactEcosystem;
