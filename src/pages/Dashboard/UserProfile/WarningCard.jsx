import { AlertTriangle } from 'lucide-react';
import React from 'react';

const WarningCard = ({dbUser,role}) => {
    return (
        <>
        {role !== 'admin' && (
          <div className="mt-6 w-full">
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                  Attendance Record
                </h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  dbUser?.warnings >= 4 ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' :
                  dbUser?.warnings >= 2 ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300' :
                  dbUser?.warnings >= 1 ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' :
                  'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                }`}>
                  {dbUser?.warnings >= 4 ? 'Permanently Banned' :
                  dbUser?.warnings >= 2 ? `Banned (${dbUser?.banEndDate ? Math.ceil((new Date(dbUser.banEndDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0} days left)` :
                  dbUser?.warnings >= 1 ? `${dbUser?.warnings || 0} Warning${(dbUser?.warnings || 0) > 1 ? 's' : ''}` :
                  'Good Standing'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Missed Attendances:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{dbUser?.warnings || 0}/4</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      dbUser?.warnings >= 4 ? 'bg-red-500' :
                      dbUser?.warnings >= 3 ? 'bg-orange-500' :
                      dbUser?.warnings >= 2 ? 'bg-yellow-500' :
                      dbUser?.warnings >= 1 ? 'bg-yellow-400' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((dbUser?.warnings || 0) / 4 * 100, 100)}%` }}
                  />
                </div>
                
                {dbUser?.warnings > 0 && (
                  <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="font-medium mb-2">Warning System:</p>
                    <ul className="space-y-1">
                      <li className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${dbUser?.warnings >= 1 ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                        1st miss: Warning issued
                      </li>
                      <li className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${dbUser?.warnings >= 2 ? 'bg-orange-400' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                        2nd miss: 10-day registration ban
                      </li>
                      <li className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${dbUser?.warnings >= 3 ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                        3rd miss: 20-day registration ban
                      </li>
                      <li className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${dbUser?.warnings >= 4 ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                        4th miss: Permanent registration ban
                      </li>
                    </ul>
                  </div>
                )}
                
                {dbUser?.banEndDate && dbUser?.warnings < 4 && new Date(dbUser.banEndDate) > new Date() && (
                  <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <div className="text-sm">
                        <p className="font-medium text-orange-800 dark:text-orange-300">Registration Suspended</p>
                        <p className="text-orange-700 dark:text-orange-200">
                          You can register for events again on {new Date(dbUser.banEndDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </>

  );
};

export default WarningCard;