import React from 'react';
import { SeatingArrangement } from '../types';

interface RecentArrangementsProps {
  arrangements: SeatingArrangement[];
}

const RecentArrangements: React.FC<RecentArrangementsProps> = ({ arrangements }) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">סידורים אחרונים</h2>
      <ul>
        {arrangements.map((arrangement, index) => (
          <li key={index} className="border p-2 mb-2">
            <a href={`/arrangements/${index}`} className="text-blue-500">סידור {index + 1}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentArrangements;
