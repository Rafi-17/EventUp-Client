import React from 'react';
import { Copy, Key, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useTheme from '../../../hooks/useTheme';

const SecretCodeModal = ({ isOpen, onClose, event }) => {
    const {darkMode} = useTheme();
    if (!isOpen || !event) return null;
    // console.log(event);

    const handleCopy = () => {
        navigator.clipboard.writeText(event.secretCode);
        toast.success('Secret code copied to clipboard!', {
            position: 'top-center',
            style: {
                background: darkMode ? '#1F2937' : 'white',
                color: darkMode ? '#F9FAFB' : '#111827',
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-11/12 max-w-md mx-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                        <Key className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Event Secret Code
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Share this code with your volunteers for attendance tracking.
                    </p>
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between space-x-4">
                        <span className="text-xl font-mono text-gray-900 dark:text-gray-100">
                            {event?.secretCode}
                        </span>
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-md text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecretCodeModal;