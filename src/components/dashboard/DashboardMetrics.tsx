import React from 'react';
import { CalendarDays, CheckCircle, Clock, FileText } from 'lucide-react';

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description?: string;
  color?: string;
}

const Metric: React.FC<MetricProps> = ({ icon, label, value, description, color = 'bg-blue-500' }) => (
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

interface DashboardMetricsProps {
  completedForms?: number;
  totalForms?: number;
  daysRemaining?: number;
  nextDeadline?: string;
}

export default function DashboardMetrics({ 
  completedForms = 0, 
  totalForms = 7, 
  daysRemaining = 30, 
  nextDeadline = 'June 30, 2025' 
}: DashboardMetricsProps) {
  const completionPercentage = totalForms > 0 
    ? Math.round((completedForms / totalForms) * 100) 
    : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Metric 
        icon={<CheckCircle size={24} />} 
        label="Form Completion" 
        value={`${completionPercentage}%`}
        description={`${completedForms}/${totalForms} forms completed`}
        color="bg-green-500"
      />
      
      <Metric 
        icon={<Clock size={24} />} 
        label="Time Remaining" 
        value={`${daysRemaining} days`}
        description="Until final deadlines"
        color="bg-amber-500"
      />
      
      <Metric 
        icon={<CalendarDays size={24} />} 
        label="Next Deadline" 
        value={nextDeadline}
        description="For Performance Bond Form"
        color="bg-blue-500"
      />
      
      <Metric 
        icon={<FileText size={24} />} 
        label="Required Forms" 
        value={`${totalForms} forms`}
        description="To complete your registration"
        color="bg-indigo-500"
      />
    </div>
  );
} 