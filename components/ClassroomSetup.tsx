import React, { useState } from 'react';
import type { ClassroomSetup as ClassroomSetupType } from '../types';

interface Props {
  onSetup: (setup: ClassroomSetupType) => void;
}

const ClassroomSetup: React.FC<Props> = ({ onSetup }) => {
  const [numTables, setNumTables] = useState<string>("");
  const [chairsPerTable, setChairsPerTable] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetup({
      numTables: Number(numTables) || 0,
      chairsPerTable: Number(chairsPerTable) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-11'>
      <div>
        <div className="sm:col-span-3">
          <label className="block">
            מספר שולחנות:
          </label>
          <div className="mt-1">
            <input
            required
              placeholder='0'
              min={1}
              type="number"
              value={numTables}
              onChange={(e) => setNumTables(e.target.value)}
              className="w-24 pr-1 rounded-md py-1 custom-number-input bg-indigo-900 ring-1 hover:bg-indigo-800 active:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-700"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block mb-1">
          כיסאות לכל שולחן:
        </label>
        <div>
          <input
          required
            placeholder='0'
            min={1}
            type="number"
            value={chairsPerTable}
            onChange={(e) => setChairsPerTable(e.target.value)}
            className="w-24 pr-1 rounded-md py-1 custom-number-input bg-indigo-900 ring-1 hover:bg-indigo-800 active:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-700"
          />
        </div>
      <button type="submit" className="bg-blue-500 rounded-md hover:bg-blue-600 p-2 mt-36">הגדרת כיתה</button>
      </div>
      <style jsx>{`
        .custom-number-input::-webkit-outer-spin-button,
        .custom-number-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .custom-number-input {
          -moz-appearance: textfield;
        }
      `}</style>
    </form>
  );
};

export default ClassroomSetup;
