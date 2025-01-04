import React from 'react';
import { Script } from '../types';
import { Play, Pause, Calendar, FileText } from 'lucide-react';
import { ScriptScheduleModal } from './ScriptScheduleModal';
import { ScriptLogsModal } from './ScriptLogsModal';

interface Props {
  scripts: Script[];
  onRunNow: (scriptId: string) => Promise<void>;
  onToggle: (scriptId: string) => Promise<void>;
  onUpdateSchedule: (scriptId: string, cronExpression: string) => Promise<void>;
}

export function ScriptList({ scripts, onRunNow, onToggle, onUpdateSchedule }: Props) {
  const [scheduleModalScript, setScheduleModalScript] = React.useState<Script | null>(null);
  const [logsModalScript, setLogsModalScript] = React.useState<Script | null>(null);

  return (
    <div className="space-y-4">
      {scripts.map((script) => (
        <div
          key={script.id}
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">{script.name}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRunNow(script.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                title="Run Now"
              >
                <Play className="w-5 h-5" />
              </button>
              <button
                onClick={() => onToggle(script.id)}
                className={`p-2 ${
                  script.status === 'paused' ? 'text-blue-600' : 'text-orange-600'
                } hover:bg-gray-50 rounded-full transition-colors`}
                title={script.status === 'paused' ? 'Resume' : 'Pause'}
              >
                <Pause className="w-5 h-5" />
              </button>
              <button
                onClick={() => setScheduleModalScript(script)}
                className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                title="Schedule"
              >
                <Calendar className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLogsModalScript(script)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                title="View Logs"
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Status: <span className="capitalize">{script.status}</span>
            {script.cronExpression && (
              <span className="ml-4">Schedule: {script.cronExpression}</span>
            )}
          </div>
        </div>
      ))}

      {scheduleModalScript && (
        <ScriptScheduleModal
          script={scheduleModalScript}
          onClose={() => setScheduleModalScript(null)}
          onUpdate={onUpdateSchedule}
        />
      )}

      {logsModalScript && (
        <ScriptLogsModal
          script={logsModalScript}
          onClose={() => setLogsModalScript(null)}
        />
      )}
    </div>
  );
}