import { Student, ClassroomSetup, SeatingArrangement } from '../types';

// Categorize students
const hasPoorVision = (student: Student) => student.hasPoorVision;
const isTall = (student: Student) => student.height === 'tall';
const isShort = (student: Student) => student.height === 'short';

// Function to arrange students in the class based on setup types
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

  // Adding a new empty Array of tables
  const tables: Student[][] = Array.from({ length: setup.numTables }, () => []);

  // divide the students to tables
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

// Handling the shuffle students in the tables while take care the previes shuffle
export const shuffleArrangement = (
  currentArrangement: SeatingArrangement,
  setup: ClassroomSetup,
  previousArrangements: SeatingArrangement[]
): SeatingArrangement => {
  if (!currentArrangement || !currentArrangement.tables) {
    return currentArrangement;
  }

  // Making a new one array from the students
  const students = currentArrangement.tables.flat();

  // If there are no students return the current arrangement
  if (students.length === 0) {
    return currentArrangement;
  }

  // For comparing the previus arrangements with the new one we need to flat all of them
  const previousSeatings = previousArrangements
    ? previousArrangements.map(arr => arr.tables.flat())
    : [];

    // Checking if student sat next to is friend and if there are none students next to him
  const hasRecentlySatNextTo = (student: Student, neighbor: Student): boolean => {
    return previousSeatings.some(seating => {
      for (let i = 0; i < seating.length; i++) {
        if (seating[i]._id === student._id) {
          const neighbors = [
            seating[i - 1], 
            seating[i + 1], 
            // If there is no students from left or right = filter
          ].filter(Boolean);
          return neighbors.some(n => n._id === neighbor._id);
        }
      }
      return false;
    });
  };

  // Use random to shuffle students
  const shuffledStudents = students.sort(() => Math.random() - 0.5);

  // Adding a new tables to the new shuffle
  const newTables: Student[][] = Array.from({ length: setup.numTables }, () => []);

  // Calculate the minimum number of students seating by a one table
  const minStudentsPerTable = Math.floor(shuffledStudents.length / setup.numTables);
  // Calculate how many tables to seating all students
  const extraStudents = shuffledStudents.length % setup.numTables;

  let tableIndex = 0;

  // Check if the the current table if full or not if yes it move to the next table in the array
  shuffledStudents.forEach((student, index) => {
    if (newTables[tableIndex].length >= minStudentsPerTable + (tableIndex < extraStudents ? 1 : 0)) {
      tableIndex = (tableIndex + 1) % setup.numTables;
    }

    let seated = false;

    // Check if the current student sat next to is friend and if not = push to the seat
    for (let i = 0; i < newTables[tableIndex].length; i++) {
      const lastStudent = newTables[tableIndex][i];
      if (!hasRecentlySatNextTo(student, lastStudent)) {
        newTables[tableIndex].push(student);
        seated = true;
        break;
      }
    }

    // if there no other way to make them seat adding him any way
    if (!seated) {
      newTables[tableIndex].push(student);
    }

    // If the table is full moving to the next table
    if (newTables[tableIndex].length >= setup.chairsPerTable) {
      tableIndex = (tableIndex + 1) % setup.numTables;
    }
  });

  return { tables: newTables };
};