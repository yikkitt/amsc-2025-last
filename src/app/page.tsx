import { redirect } from 'next/navigation';

export default function HomePage() {
  // Direct redirect to signin page as requested
  return redirect('/auth/signin');
}