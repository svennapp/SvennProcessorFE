import React from 'react';
import { Script } from '../types';

interface Props {
  script: Script;
  onClose: () => void;
}

export function ScriptLogsModal({ script, onClose }: Props) {
  // Mock data for logs - to be replaced with actual API data
  const mockLogs = [
    { timestamp: '2024-03-10 10:00:00', level: 'INFO', message: 'Script started' },
    { timestamp: '2024-03-10 10:00:05', level: 'INFO', message: 'Processing data' },
    { timestamp: '2024-03-10 10:00:10', level: 'SUCCESS', message: 'Script completed successfully' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Logs - {script.name}</h2>
        <div className="flex-1 overflow-auto">
          <pre className="bg-gray-100 p-4 rounded-md text-sm font-mono">
            {mockLogs.map((log, index) => (
              <div key={index} className="mb-1">
                <span className="text-gray-500">{log.timestamp}</span>{' '}
                <span className={`font-semibold ${
                  log.level === 'ERROR' ? 'text-red-600' :
                  log.level === 'SUCCESS' ? 'text-green-600' :
                  'text-blue-600'
                }`}>
                  [{log.level}]
                </span>{' '}
                {log.message}
              </div>
            ))}
          </pre>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}