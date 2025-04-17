import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-4xl text-center">
          {/* Logo/Banner */}
          <div className="mb-8">
            <Image 
              src="/images/amsc-2025-banner.png" 
              alt="AMSC 2025" 
              width={800} 
              height={200}
              className="max-w-full h-auto mx-auto"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Exhibitor Manual Portal
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Welcome to the AMSC 2025 Exhibitor Manual Portal. Log in to access your exhibitor information and manage your booth requirements.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register as Exhibitor
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 