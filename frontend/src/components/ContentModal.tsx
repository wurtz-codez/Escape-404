import React from 'react';
import { Content } from '../data/content';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (isCorrect: boolean) => void;
  content: Content;
}

const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, onSubmit, content }) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    // For now, always return true as we don't have actual puzzle/task logic
    onSubmit(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">{content.title}</h2>
        <p className="text-gray-600 mb-6">
          {content.type === 'puzzle' 
            ? "Solve this puzzle to proceed..."
            : "Complete this task to continue..."}
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentModal;