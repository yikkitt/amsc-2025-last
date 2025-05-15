import React from 'react';
import { CalendarDays, CheckCircle, Clock, FileText } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
  color?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon, 
  label, 
  value, 
  description, 
  color = 'bg-blue-500' 
}) => (
  <div className="bg-white rounded-xl shadow-sm p-5 flex items-start">
    <div className={`${color} text-white p-3 rounded-lg mr-4`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <h3 className="text-xl font-bold mt-1">{value}</h3>
      {description && <p className="text-gray-400 text-xs mt-1">{description}</p>}
    </div>
  </div>
);

interface DashboardTopCardsProps {
  userId: string;
}

export default function DashboardTopCards({ userId }: DashboardTopCardsProps) {
  // In a real application, these values would be fetched from a database
  // based on the user's profile and form submissions
  const metrics = {
    completedForms: 2,
    totalForms: 7,
    daysRemaining: 57,
    nextDeadline: '30th June 2025'
  };
  
  const completionPercentage = metrics.totalForms > 0 
    ? Math.round((metrics.completedForms / metrics.totalForms) * 100) 
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard 
        icon={<CheckCircle size={24} />} 
        label="Form Completion" 
        value={`${completionPercentage}%`}
        description={`${metrics.completedForms}/${metrics.totalForms} forms completed`}
        color="bg-green-500"
      />
      
      <MetricCard 
        icon={<Clock size={24} />} 
        label="Time Remaining" 
        value={`${metrics.daysRemaining} days`}
        description="Until final deadlines"
        color="bg-amber-500"
      />
      
      <MetricCard 
        icon={<CalendarDays size={24} />} 
        label="Next Deadline" 
        value={metrics.nextDeadline}
        description="For Performance Bond Form"
        color="bg-blue-500"
      />
      
      <MetricCard 
        icon={<FileText size={24} />} 
        label="Required Forms" 
        value={`${metrics.totalForms} forms`}
        description="To complete your registration"
        color="bg-indigo-500"
      />
    </div>
  );
} 