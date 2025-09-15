import { Copy, X } from 'lucide-react';
import React, { useState } from 'react';

const DuplicateEventModal = ({isOpen, event, onConfirm, onCancel}) => {
    const [date, setDate] = useState('');
    if(!isOpen){
        return null;
    }
    const handleConfirm=()=>{
        onConfirm(event, date);
    }
    const handleCancel =()=>{
        onCancel();
    }
    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4'>
            <div className='bg-white p-6 rounded-xl max-w-md w-full'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='flex items-center text-lg font-semibold text-gray-900'>
                        <Copy className='mr-2 w-5 h-5 text-sky-600'/>
                        Duplicate Event
                    </h3>
                    <button onClick={handleCancel} className='text-gray-400 hover:text-gray-600'>
                        <X className='w-5 h-5'/>
                    </button>
                </div>
                <div className='mb-6'>
                    <p className='text-gray-600'>Are you sure want to create a copy of  <strong>'{event?.title}'</strong></p>
                    <p className="text-sm text-gray-500 mt-2">This action cannot be undone and the event will be published.</p>
                    <div className='mt-4'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason for cancellation <span className="text-red-500">*</span>
                            </label>
                            <input
                            type='datetime-local'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            placeholder="Please explain why you are cancelling this event..."
                            className="w-full outline-none p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#FF6B00] focus:border-transparent text-sm"
                            rows="3"
                            required
                            />
                    </div>
                </div>
                <div className='flex justify-end space-x-3'>
                    <button onClick={handleCancel} className='px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>Cancel</button>
                    <button onClick={handleConfirm} className='bg-sky-600 rounded-lg px-4 py-2 text-white hover:bg-sky-700 transition-colors'>Duplicate Event</button>
                </div>
            </div>
        </div>
    );
};

export default DuplicateEventModal;