import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Student } from '../types';
import { SignInButton, useUser } from '@clerk/nextjs';

interface SeatingRestrictionsProps {
    students: Student[];
    restrictedPairs: [string, string][];
    setRestrictedPairs: React.Dispatch<React.SetStateAction<[string, string][]>>;
}

const SeatingRestrictions: React.FC<SeatingRestrictionsProps> = ({
    students,
    restrictedPairs,
    setRestrictedPairs
}) => {
    const [student1, setStudent1] = useState<string>('');
    const [student2, setStudent2] = useState<string>('');
    const [enforceRestrictions, setEnforceRestrictions] = useState(false);
    const { isSignedIn } = useUser();

    const handleAddRestrictedPair = () => {
        if (student1 && student2 && student1 !== student2) {
            const pairExists = restrictedPairs.some(
                ([a, b]) => (a === student1 && b === student2) || (a === student2 && b === student1)
            );

            if (!pairExists) {
                setRestrictedPairs([...restrictedPairs, [student1, student2]]);
                setStudent1('');
                setStudent2('');
            } else {
                toast.warning('הגבלה זו כבר קיימת', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } else if (student1 === student2) {
            toast.error('לא ניתן להגביל תלמיד עם עצמו', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.error('יש לבחור שני תלמידים שונים', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleRemoveRestrictedPair = (index: number) => {
        const newPairs = [...restrictedPairs];
        newPairs.splice(index, 1);
        setRestrictedPairs(newPairs);
    };

    return (
        <div className="mb-4 mt-4">
            {isSignedIn ? (
                <>
                    <h2 className="text-xl font-semibold mb-2">הגבלות ישיבה</h2>
                    <div className="flex items-center mb-2">
                        <input
                        className='ml-1'
                            type="checkbox"
                            id="enforceRestrictions"
                            checked={enforceRestrictions}
                            onChange={(e) => setEnforceRestrictions(e.target.checked)}
                        />
                        <label htmlFor="enforceRestrictions">הפעלת הגבלות ישיבה</label>
                    </div>
                    {enforceRestrictions && (
                        <div>
                            <select
                                value={student1}
                                onChange={(e) => setStudent1(e.target.value)}
                                className="text-white rounded-md bg-blue-900"
                            >
                                <option value="">בחר/י תלמיד</option>
                                {students.map((student) => (
                                    <option key={student._id} value={student._id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={student2}
                                onChange={(e) => setStudent2(e.target.value)}
                                className="text-white rounded-md bg-blue-900 mr-2"
                            >
                                <option value="">בחר/י תלמיד</option>
                                {students
                                    .filter((student) => student._id !== student1)
                                    .map((student) => (
                                        <option key={student._id} value={student._id}>
                                            {student.name}
                                        </option>
                                    ))}
                            </select>
                            <button
                                onClick={handleAddRestrictedPair}
                                className="bg-blue-500 text-white px-2 mr-3 py-1 rounded"
                            >
                                הוספת הגבלה
                            </button>
                        </div>
                    )}
                    <ul className="mt-2">
                        {restrictedPairs.map(([student1Id, student2Id], index) => (
                            <li key={index} className="mb-1">
                                {students.find((s) => s._id === student1Id)?.name} -{' '}
                                {students.find((s) => s._id === student2Id)?.name}
                                <button
                                    onClick={() => handleRemoveRestrictedPair(index)}
                                    className="mr-2 mt-2 rounded-md px-0.5 bg-red-400 text-red-900 border-0"
                                >
                                    הסר
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <SignInButton mode="modal">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">התחבר</button>
                </SignInButton>
            )}
        </div>
    );

};

export default SeatingRestrictions;