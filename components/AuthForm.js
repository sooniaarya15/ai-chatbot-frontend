import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const { login, signup } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (isSignup) await signup(form.name, form.email, form.password);
      else await login(form.email, form.password);
      router.push('/chat');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const input =
    'w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow dark:bg-gray-800 dark:text-gray-100"
      >
        <h1 className="text-xl font-semibold">{isSignup ? 'Create account' : 'Welcome back'}</h1>
        {isSignup && (
          <input name="name" placeholder="Name" value={form.name} onChange={change} className={input} required />
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} className={input} required />
        <input name="password" type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={change} className={input} required minLength={6} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
          {busy ? 'Please wait…' : isSignup ? 'Sign up' : 'Log in'}
        </button>
        <p className="text-center text-sm text-gray-500">
          {isSignup ? 'Already have an account? ' : "Don't have an account? "}
          <Link href={isSignup ? '/login' : '/signup'} className="text-blue-600 hover:underline">
            {isSignup ? 'Log in' : 'Sign up'}
          </Link>
        </p>
      </form>
    </div>
  );
}