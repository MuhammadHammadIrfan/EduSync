import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function DashboardCard({ title, value, icon, bgColor, href, increase }) {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${bgColor || 'bg-white'}`}>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`text-sm font-medium ${bgColor ? 'text-white' : 'text-gray-500'}`}>
              {title}
            </h3>
            <p className={`text-2xl font-bold mt-1 ${bgColor ? 'text-white' : 'text-gray-800'}`}>
              {value}
            </p>
            
            {increase !== undefined && (
              <p className={`text-xs mt-1 ${increase >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {increase >= 0 ? '+' : ''}{increase}% from last month
              </p>
            )}
          </div>
          
          <div className={`p-2 rounded-lg ${bgColor ? 'bg-white/20' : 'bg-blue-100'}`}>
            {icon}
          </div>
        </div>
        
        {href && (
          <Link href={href} legacyBehavior>
            <a className={`flex items-center text-sm mt-4 font-medium ${
              bgColor ? 'text-white/80 hover:text-white' : 'text-blue-600 hover:text-blue-700'
            }`}>
              <span>View details</span>
              <FiArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
