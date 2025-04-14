import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';

export default function HomePage() {
  // Changed redirect method to handle both /auth/signin and alternative paths
  return redirect('/auth/signin');

  // Original login form code commented out for now
  /*
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
    </main>
  );
  */
} 