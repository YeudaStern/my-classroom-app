import React, { useState, useEffect } from 'react';
import { Student } from '../types';

interface StudentInputProps {
  onAddStudent: (student: Student) => void;
}

const StudentInput: React.FC<StudentInputProps> = ({ onAddStudent }) => {
  const [name, setName] = useState('');
  const [height, setHeight] = useState<'tall' | 'average' | 'short'>('average');
  const [hasPoorVision, setHasPoorVision] = useState(false);
  const [isFlashing, setIsFlashing] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsFlashing(false), 10000); 
    return () => clearTimeout(timeoutId); 
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent({ _id: Date.now().toString(), name, height, hasPoorVision });
    setName('');
    setHeight('average');
    setHasPoorVision(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-11">
      <div className=''>
        <label className="block mb-1">שם:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="pr-1 rounded-md py-1 custom-number-input bg-indigo-900 ring-1 hover:bg-indigo-800 active:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-700"
        />
      </div>
      <div className='mx-auto'>
        <div>
          <label className="block mb-1">גובה:</label>
          <select
            value={height}
            onChange={(e) => setHeight(e.target.value as 'tall' | 'average' | 'short')}
            className="p-2 rounded bg-indigo-900"
          >
            <option value="tall">גבוה</option>
            <option value="average">ממוצע</option>
            <option value="short">נמוך</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-1">האם יש קוצר ראייה\שמיעה?</label>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setHasPoorVision(!hasPoorVision)}
            className={`focus:outline-none px-2 rounded text-white ${hasPoorVision ? 'bg-red-800' : 'bg-lime-800'
              } ${isFlashing ? 'animate-flash' : ''}`}
          >
            {hasPoorVision ? 'יש' : 'אין'}
          </button>
        </div>

      </div>
      <div className=''>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded">הוספת תלמיד</button>
      </div>
      <style jsx>{`
        @keyframes flash {
          0% { opacity: 0.5; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-flash {
          animation: flash 3s infinite;
        }
      `}</style>
    </form>
  );
};

export default StudentInput;
