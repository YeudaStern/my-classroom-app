import React, { useState } from 'react';
import { Student } from '../types';
import Model from './Model';

interface StudentsListProps {
  students: Student[];
  onDeleteStudent: (studentId: string) => void;
}

const StudentsList: React.FC<StudentsListProps> = ({ students, onDeleteStudent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const handleOpenModal = (studentId: string) => {
    setStudentToDelete(studentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setStudentToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      onDeleteStudent(studentToDelete);
    }
    handleCloseModal();
  };

  const getBackgroundColor = (student: Student) => {
    if (student.hasPoorVision) return 'bg-orange-900 text-orange-500';
    if (student.height === 'tall') return 'bg-gray-900';
    if (student.height === 'short') return 'bg-indigo-500 text-indigo-500';
    return 'bg-green-900 text-green-500';
  };

  const getEmoji = (student: Student) => {
    if (student.hasPoorVision) return '👓'; 
    if (student.height === 'short') return '📏';
    if (student.height === 'average') return '📐';
    return '';
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-4">
        {students.map(student => (
          <div
            key={student._id}
            className={`p-1 rounded-md text-white flex justify-between items-center ${getBackgroundColor(student)}`}
          >
            <span className="flex items-center">
              <span className="mr-2 text-xl">{getEmoji(student)}</span> {student.name}
            </span>
            <button
              onClick={() => handleOpenModal(student._id)}
              className="text-red-400 px-1 bg-red-900 rounded-md transition duration-300 ease-in-out"
              aria-label={`מחק את ${student.name}`}
            >
              מחק
            </button>
          </div>
        ))}
      </div>

      {studentToDelete && (
        <Model
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          studentName={students.find(student => student._id === studentToDelete)?.name || ''}
        />
      )}
    </div>
  );
};

export default StudentsList;
