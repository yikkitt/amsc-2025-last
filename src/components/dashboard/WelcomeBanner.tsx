import React from 'react';
import Image from 'next/image';

interface WelcomeBannerProps {
  username?: string;
  companyName?: string;
}

export default function WelcomeBanner({ username = 'User', companyName = 'Your Company' }: WelcomeBannerProps) {
  // Get current time to customize greeting
  const currentHour = new Date().getHours();
  let greeting = "Good Morning";
  
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good Evening";
  }

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-6 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-500 rounded-full opacity-30"></div>
      <div className="absolute right-20 bottom-8 w-20 h-20 bg-blue-500 rounded-full opacity-20"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{greeting}, {username}!</h1>
          <p className="text-blue-100">{companyName}</p>
          <p className="text-blue-100 mt-2 max-w-xl">
            Welcome to your AMSC dashboard. Here you can access all forms, venue information, and updates for the upcoming event.
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <a 
            href="/dashboard/forms" 
            className="inline-block bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-50 transition-colors"
          >
            View Required Forms
          </a>
        </div>
      </div>
    </div>
  );
} 