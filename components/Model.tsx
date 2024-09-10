import React, { useRef, useEffect } from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    studentName: string;
}

const Model: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, studentName }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    // Handle click outside of the modal to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
            <div
                ref={modalRef}
                className="bg-zinc-900 p-10 rounded-md shadow-lg max-w-sm mx-auto border-t-2 border-orange-500"
            >
                <p className="mb-6">האם למחוק את התלמיד <strong>{studentName}</strong>?</p>
                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                    >
                        מחק
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-200"
                    >
                        ביטול
                    </button>
                    <p className='text-3xl mr-5'>⚠️</p>
                    
                </div>
            </div>
        </div>
    );
};

export default Model;
