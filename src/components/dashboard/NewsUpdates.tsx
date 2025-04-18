import React from 'react';
import { ScrollText } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

// Mock data - in a real application, this would come from an API
const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Exhibitor Manual Released',
    content: 'The complete exhibitor manual for AMSC 2025 is now available for download.',
    date: 'May 15, 2025'
  },
  {
    id: '2',
    title: 'Early Bird Registration Deadline Approaching',
    content: 'Don\'t miss the early bird rates for additional passes. Deadline is June 30.',
    date: 'May 10, 2025'
  },
  {
    id: '3',
    title: 'New Sponsorship Opportunities',
    content: 'Additional sponsorship packages are now available for the networking reception.',
    date: 'May 5, 2025'
  },
  {
    id: '4',
    title: 'Hotel Booking Portal Open',
    content: 'The official hotel booking portal is now open with special rates for exhibitors.',
    date: 'May 1, 2025'
  }
];

export default function NewsUpdates() {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 flex items-center">
        <ScrollText className="text-white mr-2" size={20} />
        <h3 className="text-lg font-semibold text-white">News & Updates</h3>
      </div>
      
      <div className="p-4">
        <div className="divide-y">
          {newsItems.map((item) => (
            <div key={item.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{item.content}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <a 
            href="/dashboard/news"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all announcements →
          </a>
        </div>
      </div>
    </div>
  );
} 