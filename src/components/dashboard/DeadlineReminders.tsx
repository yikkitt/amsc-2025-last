import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface Deadline {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
  priority: 'high' | 'medium' | 'low';
}

// Mock data - in a real application, this would come from an API
const deadlines: Deadline[] = [
  {
    id: 'd1',
    title: 'Performance Bond Form Submission',
    date: 'June 30, 2025',
    daysLeft: 30,
    priority: 'high'
  },
  {
    id: 'd2',
    title: 'Contractor Pass Application',
    date: 'July 15, 2025',
    daysLeft: 45,
    priority: 'medium'
  },
  {
    id: 'd3',
    title: 'Electrical & Lighting Order',
    date: 'July 20, 2025',
    daysLeft: 50,
    priority: 'medium'
  },
  {
    id: 'd4',
    title: 'Special Design Submission',
    date: 'July 25, 2025',
    daysLeft: 55,
    priority: 'low'
  }
];

export default function DeadlineReminders() {
  // Helper function to determine color based on priority
  const getPriorityColor = (priority: Deadline['priority'], element: 'bg' | 'text' | 'border') => {
    const colors = {
      high: {
        bg: 'bg-red-100',
        text: 'text-red-700',
        border: 'border-red-200'
      },
      medium: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-200'
      },
      low: {
        bg: 'bg-green-100',
        text: 'text-green-700',
        border: 'border-green-200'
      }
    };
    
    return colors[priority][element];
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center">
        <Calendar className="text-white mr-2" size={20} />
        <h3 className="text-lg font-semibold text-white">Upcoming Deadlines</h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {deadlines.map((deadline) => (
            <div 
              key={deadline.id} 
              className={`p-3 rounded-lg border ${getPriorityColor(deadline.priority, 'border')} ${getPriorityColor(deadline.priority, 'bg')}`}
            >
              <div className="flex justify-between items-start">
                <h4 className={`font-medium ${getPriorityColor(deadline.priority, 'text')}`}>
                  {deadline.title}
                </h4>
                <span className="text-xs font-semibold text-gray-500">
                  {deadline.date}
                </span>
              </div>
              
              <div className="mt-2 flex items-center">
                <Clock size={14} className="text-gray-500 mr-1" />
                <span className="text-xs text-gray-600">
                  {deadline.daysLeft} days remaining
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <a 
            href="/dashboard/deadlines"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all deadlines →
          </a>
        </div>
      </div>
    </div>
  );
} 