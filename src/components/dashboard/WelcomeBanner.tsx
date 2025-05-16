import React from 'react';

interface WelcomeBannerProps {
  firstName?: string;
  companyName?: string;
  profileCompleted?: boolean;
  hideViewFormsButton?: boolean;
}

export default function WelcomeBanner({ 
  firstName = 'User',
  companyName = 'Your Company', 
  profileCompleted = false,
  hideViewFormsButton = false
}: WelcomeBannerProps) {
  // Get current time to customize greeting
  const currentHour = new Date().getHours();
  let greeting = "Good Morning";
  
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good Evening";
  }

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-4 sm:p-6 mb-6 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-blue-500 rounded-full opacity-30"></div>
      <div className="absolute right-20 bottom-8 w-20 h-20 bg-blue-500 rounded-full opacity-20"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-center justify-between">
        <div className="text-center md:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{greeting}, {firstName}!</h1>
          <p className="text-blue-100">{companyName}</p>
          <p className="text-blue-100 mt-2 max-w-xl text-sm sm:text-base">
            Welcome to your AMSC dashboard. Here you can access venue information and updates for the upcoming event.
          </p>
        </div>
        
        {!hideViewFormsButton && (
          <div className="mt-4 md:mt-0">
            <a 
              href="/dashboard/forms" 
              className="inline-block bg-white text-blue-600 font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg shadow hover:bg-blue-50 transition-colors text-sm sm:text-base"
            >
              View Required Forms
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 