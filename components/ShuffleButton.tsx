import React from 'react';

interface ShuffleButtonProps {
  onShuffle: () => void;
}

const ShuffleButton: React.FC<ShuffleButtonProps> = ({ onShuffle }) => {
  return (
    <button className='p-2 bg-blue-500 rounded-md' onClick={onShuffle}>ערבב תלמידים</button>
  );
};

export default ShuffleButton;
