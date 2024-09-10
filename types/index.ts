export interface Student {
  _id: string;
  name: string;
  height: 'tall' | 'average' | 'short';
  hasPoorVision: boolean;
}

export interface ClassroomSetup {
  numTables: number;
  chairsPerTable: number;
}

export type Table = Student[];

export interface SeatingArrangement {
  tables: Table[];
}

export type SeatingHistory = {
  [studentId: string]: Set<string>;
};