'use client'

import React, { useState, useEffect, useCallback } from 'react';
import StudentInput from '../components/StudentInput';
import ClassroomSetup from '../components/ClassroomSetup';
import SeatingArrangement from '../components/SeatingArrangement';
import ShuffleButton from '../components/ShuffleButton';
import StudentsList from '@/components/StudentsList';
import SeatingRestrictions from '@/components/SeatingRestrictions';
import { Student, ClassroomSetup as ClassroomSetupType, SeatingArrangement as SeatingArrangementType } from '../types';
import { arrangeSeats, shuffleArrangement } from '../lib/seatingAlgorithm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useUser } from '@clerk/nextjs';
import { SignInButton } from '@clerk/nextjs';
import PreviousArrangements from '@/components/PreviousArrangements';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const { isSignedIn, user } = useUser();

  const [students, setStudents] = useState<Student[]>([]);
  const [classroomSetup, setClassroomSetup] = useState<ClassroomSetupType | null>(null);
  const [seatingArrangement, setSeatingArrangement] = useState<SeatingArrangementType | null>(null);
  const [previousArrangements, setPreviousArrangements] = useState<SeatingArrangementType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [restrictedPairs, setRestrictedPairs] = useState<[string, string][]>([]);
  const route = useRouter()

  // Check if there are user sign in and call to students and arrangements from the server
  useEffect(() => {
    if (user) {
      fetchData();
      fetchArrangements()
    }
  }, [user]);

  // Check if there is no user sign in and reset all states
  useEffect(() => {
    if (!isSignedIn) {
      setStudents([]);
      setClassroomSetup(null);
      setSeatingArrangement(null);
      setPreviousArrangements([]);
      setRestrictedPairs([]);
    }
  }, [isSignedIn]);

// Fetch data of students from server
  const fetchData = async () => {
    try {
      const response = await fetch(`/api/students?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();

      if (data.students && Array.isArray(data.students)) {
        setStudents(data.students);
      }

      if (data.arrangements && Array.isArray(data.arrangements)) {
        setPreviousArrangements(data.arrangements);
        if (data.arrangements.length > 0) {
          setSeatingArrangement(data.arrangements[data.arrangements.length - 1]);
        }
      }

      setError(null);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('אירעה שגיאה בטעינת נתונים.');
    }
  };

  // Fetch data of arrangements from server
  const fetchArrangements = async () => {
    try {
      const response = await fetch(`/api/arrangements?userId=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch arrangements');
      const data = await response.json();
      console.log('arrangements data:', data);
      if (data && Array.isArray(data)) {
        setPreviousArrangements(data);
        if (data.length > 0) {
          setSeatingArrangement(data[data.length - 1]);
        }
      } else {
        console.error('Invalid data format:', data);
        setError('Failed to load arrangements. Please try again.');
      }
    } catch (err) {
      console.error('Failed to fetch arrangements:', err);
      setError('Failed to load arrangements. Please try again.');
    }
  };

  // Add new student
  const handleAddStudent = useCallback(async (student: Student) => {
    if (!user?.id) {
      console.error('User ID is missing');
      toast.error('שגיאה בזיהוי המשתמש. נא לרענן את העמוד.');
      return;
    }

    try {
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...student, userId: user.id }),
      });

      if (!response.ok) throw new Error('Failed to add student');
      const newStudent = await response.json();

      setStudents(prevStudents => [...prevStudents, newStudent]);
      toast(`🤩 !התלמיד ${newStudent.name} נוסף בהצלחה`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setError(null);
    } catch (err) {
      console.error('Failed to add student:', err);
      toast.error('כישלון בהוספת תלמיד😒, נסו שוב מאוחר יותר.');
    }
  }, [user?.id]);

// Deliting a students
  const handleDeleteStudent = async (studentId: string) => {
    console.log('Deleting student with ID:', studentId);
    try {
      const response = await fetch(`/api/students?_id=${studentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete student');
      }
      const result = await response.json();
      console.log(result.message);
      toast.success(`🤩 !התלמיד נמחק בהצלחה`);
      setStudents(prev => prev.filter(student => student._id !== studentId));
    } catch (err) {
      console.error('Error:', err);
      toast.error('כישלון במחיקת תלמיד😒, נסו שוב מאוחר יותר. אנחנו נעבוד על התקלה ביינתים😊', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  // About to handle the class room setup by follow the terms 
  const handleSetupClassroom = useCallback((setup: ClassroomSetupType) => {
    if (!students.length) {
      setError('אין תלמידים להגדיר כיתה.');
      return;
    }
    
    const studentsPerTable = Math.ceil(students.length / setup.numTables);

    if (setup.numTables > students.length) {
      toast.warning('מספר השולחנות גדול מדי ביחס לכמות התלמידים.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    if (studentsPerTable > setup.chairsPerTable) {
      toast.warning('מספר השולחנות קטן מדי. יש יותר מדי תלמידים לכל שולחן.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    if (studentsPerTable > 6) {
      toast.warning('לא ניתן להגדיר מספר שולחנות קטן מדי. מספר התלמידים בכל שולחן יעלה על 6.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    if (studentsPerTable < 2) {
      toast.warning('מספר הכיסאות בשולחן קטן מדי. יש צורך בלפחות 2 כיסאות לכל שולחן.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }
    setClassroomSetup(setup);

    try {
      const arrangement = arrangeSeats(students, setup);
      setSeatingArrangement(arrangement);
      saveArrangement(arrangement);
      setPreviousArrangements(prev => [...prev, arrangement]);
      setError(null);
    } catch (err) {
      setError('אירעה שגיאה בעת סידור התלמידים.');
      console.error(err);
    }
  }, [students, restrictedPairs]);

  // About to shuffle the arrangement after the handle setup class room
  const handleShuffle = useCallback(() => {
    if (classroomSetup && seatingArrangement) {
      try {
        const newArrangements: SeatingArrangementType[] = [];
        for (let i = 0; i < 5; i++) {
          let newArrangement = shuffleArrangement(seatingArrangement, classroomSetup, previousArrangements);
          newArrangements.push(newArrangement);
        }

        if (newArrangements.length > 0) {
          setSeatingArrangement(newArrangements[0]);
          saveArrangement(newArrangements[0]);
          setPreviousArrangements(prev => [...prev, ...newArrangements]);
          setError(null);
        } else {
          setError('לא ניתן למצוא סידור ישיבה תקף עם ההגבלות הנוכחיות. אנא שנה את ההגבלות ונסה שנית.');
        }
      } catch (err) {
        setError('אירעה שגיאה בעת ערבוב התלמידים. אנא נסה שנית.');
        console.error(err);
      }
    }
  }, [classroomSetup, seatingArrangement, previousArrangements, restrictedPairs]);

  // After shuffle save the current arrangements
  const saveArrangement = async (arrangement: SeatingArrangementType) => {
    try {
      const response = await fetch('/api/arrangements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...arrangement, userId: user?.id }),
      });
      if (!response.ok) throw new Error('Failed to save arrangement');
    } catch (err) {
      console.error('Failed to save arrangement:', err);
      toast.error('Failed to save arrangement. Please try again.');
    }
  };

// Check if the user connected
  const requireAuth = (action: () => void) => {
    if (isSignedIn) {
      action();
    } else {
      toast.error('יש להתחבר כדי לבצע פעולה זו', {
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


// A bad UI 
  return (
    <div className="container mx-auto p-4 md:px-4 text-white my-4">
      <h1 className="text-3xl font-bold mb-4 text-center border-b mx-auto w-[275px]">סידור תלמידים בכיתה</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-44 my-20">
        <div className='flex flex-col justify-between'>
          <div className='flex gap-20'>
            <div className='border-l pl-16'>
              <h2 className="text-xl font-semibold mb-4">הוספת תלמידים</h2>
              {isSignedIn ? (
                <StudentInput onAddStudent={handleAddStudent} />
              ) : (
                <div>
                  <p>יש להתחבר כדי להוסיף תלמידים</p>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">הגדרת הכיתה</h2>
              {isSignedIn ? (
                <ClassroomSetup onSetup={handleSetupClassroom} />
              ) : (
                <div>
                  <p>יש להתחבר כדי להגדיר את הכיתה</p>
                </div>
              )}
            </div>
          </div>

          <SeatingRestrictions
            students={students}
            restrictedPairs={restrictedPairs}
            setRestrictedPairs={setRestrictedPairs}
          />
        </div>
        <div className='border-2 border-zinc-700 rounded-md p-6'>
          <h2 className="text-xl font-semibold mb-4 text-center ">סידור הישיבה</h2>
          <div className='text-center bg-gray-500 my-5 mx-auto w-80 text-white rounded-md'>לוח הכיתה</div>
          {seatingArrangement ? (
            <>
              <SeatingArrangement arrangement={seatingArrangement} />
              <div className="mt-4 text-center">
                {isSignedIn ? (
                  <ShuffleButton onShuffle={handleShuffle} />
                ) : (
                  <SignInButton mode="modal">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">התחבר\י כדי לערבב</button>
                  </SignInButton>
                )}
              </div>
            </>
          ) : (
            <div className='text-center'>
              <p>הוסף\י תלמידים והגדר\י את הכיתה כדי לראות את סידור הישיבה.</p><SignInButton mode="modal">
                <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">התחברות</button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
      <div className='border-t border-b rounded-full  mx-auto w-[30%] mb-10'>
        <div className='border border-black rounded-full mx-auto'></div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-center">רשימת תלמידים ( {students.length} )</h2>
      <StudentsList
        students={students}
        onDeleteStudent={(id) => requireAuth(() => handleDeleteStudent(id))}
      />
      <PreviousArrangements arrangements={previousArrangements} />
      <ToastContainer />
    </div>
  );
}

export default Home;
