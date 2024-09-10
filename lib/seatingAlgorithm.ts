import { Student, ClassroomSetup, SeatingArrangement } from '../types';

const hasPoorVision = (student: Student) => student.hasPoorVision;
const isTall = (student: Student) => student.height === 'tall';
const isShort = (student: Student) => student.height === 'short';

export const arrangeSeats = (students: Student[], setup: ClassroomSetup): SeatingArrangement => {
  const studentsSorted = students.sort((a, b) => {
    if (hasPoorVision(a) && !hasPoorVision(b)) return -1;
    if (!hasPoorVision(a) && hasPoorVision(b)) return 1;
    if (isShort(a) && !isShort(b)) return -1;
    if (!isShort(a) && isShort(b)) return 1;
    if (isTall(a) && !isTall(b)) return 1;
    if (!isTall(a) && isTall(b)) return -1;
    return 0;
  });

  const tables: Student[][] = Array.from({ length: setup.numTables }, () => []);

  let index = 0;
  while (index < studentsSorted.length) {
    for (let i = 0; i < setup.numTables && index < studentsSorted.length; i++) {
      if (tables[i].length < setup.chairsPerTable) {
        tables[i].push(studentsSorted[index]);
        index++;
      }
    }
  }

  return { tables };
};

export const shuffleArrangement = (
  currentArrangement: SeatingArrangement,
  setup: ClassroomSetup,
  previousArrangements: SeatingArrangement[]
): SeatingArrangement => {
  if (!currentArrangement || !currentArrangement.tables) {
    return currentArrangement;
  }

  const students = currentArrangement.tables.flat();

  if (students.length === 0) {
    return currentArrangement;
  }

  const previousSeatings = previousArrangements
    ? previousArrangements.map(arr => arr.tables.flat())
    : [];

  const hasRecentlySatNextTo = (student: Student, neighbor: Student): boolean => {
    return previousSeatings.some(seating => {
      for (let i = 0; i < seating.length; i++) {
        if (seating[i]._id === student._id) {
          const neighbors = [
            seating[i - 1], // תלמיד משמאל
            seating[i + 1], // תלמיד מימין
          ].filter(Boolean);
          return neighbors.some(n => n._id === neighbor._id);
        }
      }
      return false;
    });
  };

  const shuffledStudents = students.sort(() => Math.random() - 0.5);

  const newTables: Student[][] = Array.from({ length: setup.numTables }, () => []);

  // חישוב מספר התלמידים המינימלי לכל שולחן
  const minStudentsPerTable = Math.floor(shuffledStudents.length / setup.numTables);
  const extraStudents = shuffledStudents.length % setup.numTables;

  let tableIndex = 0;

  shuffledStudents.forEach((student, index) => {
    // בדיקה אם השולחן הנוכחי מלא (לפי החלוקה השווה)
    if (newTables[tableIndex].length >= minStudentsPerTable + (tableIndex < extraStudents ? 1 : 0)) {
      tableIndex = (tableIndex + 1) % setup.numTables;
    }

    let seated = false;

    for (let i = 0; i < newTables[tableIndex].length; i++) {
      const lastStudent = newTables[tableIndex][i];
      if (!hasRecentlySatNextTo(student, lastStudent)) {
        newTables[tableIndex].push(student);
        seated = true;
        break;
      }
    }

    if (!seated) {
      newTables[tableIndex].push(student);
    }

    // בדיקה נוספת אם השולחן התמלא לפי מגבלת הכיסאות
    if (newTables[tableIndex].length >= setup.chairsPerTable) {
      tableIndex = (tableIndex + 1) % setup.numTables;
    }
  });

  return { tables: newTables };
};