import { X } from "lucide-react";
import { useState } from "react";

const RemoveConfirmationModal = ({ isOpen, volunteer, onConfirm, onCancel }) => {
    const [explanation, setExplanation] = useState('');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Remove Volunteer</h3>
          <button onClick={onCancel} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to remove <strong>{volunteer?.name}</strong> from this event?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This action cannot be undone and the volunteer will be notified.
          </p>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for removal <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Please explain why you are removing this volunteer..."
                className="w-full outline-none p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-sm dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                rows="3"
                required
            />
          </div>
        </div>
        
        <div className="flex sm:justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(volunteer, explanation)}
            disabled={!explanation.trim()}
            className="px-4 py-2 bg-red-600 dark:bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-500 text-nowrap"
          >
            Remove Volunteer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemoveConfirmationModal;