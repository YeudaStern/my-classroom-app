import React from 'react';
import { SeatingArrangement as SeatingArrangementType } from '../types';
import SeatingArrangement from './SeatingArrangement'; // הנחה שקיימת קומפוננטה כזו

interface PreviousArrangementsProps {
    arrangements: SeatingArrangementType[];
}

const PreviousArrangements: React.FC<PreviousArrangementsProps> = ({ arrangements }) => {
    return (
        <div className='mt-10 text-center'>
            <div className='border-t border-b rounded-full  mx-auto w-[30%] mb-10'>
                <div className='border border-black rounded-full mx-auto'></div>
            </div>
            <h2 className="text-xl font-semibold mb-10">סידוריים קודמים</h2>
            <div className="h-64 overflow-y-scroll p-2">
                {arrangements && arrangements.length > 0 ? (
                    arrangements.map((arrangement, index) => (
                        <div key={index} className="mb-2">
                            <SeatingArrangement arrangement={arrangement} />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">אין סידוריים קודמים</p>
                )}
            </div>
        </div>
    );
};

export default PreviousArrangements;
