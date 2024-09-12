import { SeatingArrangement as SeatingArrangementType } from '../types';

interface SeatingArrangementProps {
  arrangement: SeatingArrangementType | null;
}

const SeatingArrangement: React.FC<SeatingArrangementProps> = ({ arrangement }) => {
  if (!arrangement || !arrangement.tables) {
    return <div>No seating arrangement available</div>;
  }

  const getEmoji = (student: any) => {
    if (student.hasPoorVision) return '👓';
    if (student.height === 'short') return '📏';
    if (student.height === 'average') return '📐';
    return '';
  };

  return (
    <div className="flex flex-wrap gap-4">
      {arrangement.tables.map((table, tableIndex) => (
        <div key={`table-${tableIndex}`} className="p-4 mx-auto w-52 rounded-full bg-indigo-800 shadow-md">
          <h3 className="font-bold mb-2 text-center text-white">שולחן {tableIndex + 1}</h3>
          <div className="h-32 flex-wrap overflow-y-auto custom-scrollbar grid-cols-1 items-center justify-center md:grid-cols-2 gap-2">
            {table.map((student) => (
              <div
                key={student._id}
                className={`p-1 my-2 mx-auto w-20 text-center items-center justify-center rounded-full  text-[12px] 
                  ${student.hasPoorVision
                    ? 'bg-orange-900 text-orange-500'
                    : student.height === 'tall'
                      ? 'bg-gray-900 text-gray-400'
                      : student.height === 'short'
                        ? 'bg-fuchsia-900 text-fuchsia-500'
                        : 'bg-green-900 text-green-500'
                  }`}
              >
                <span>
                  {student.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeatingArrangement;
