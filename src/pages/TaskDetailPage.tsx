/**
 * Task Detail Page
 * Page for viewing detailed task information
 */

import { useParams } from 'react-router-dom';
import { TaskDetail } from '@/components/tasks';

export default function TaskDetailPage() {
  const { id: taskId } = useParams<{ id: string }>();

  if (!taskId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400">No task ID provided</p>
      </div>
    );
  }

  return <TaskDetail taskId={taskId} />;
}
