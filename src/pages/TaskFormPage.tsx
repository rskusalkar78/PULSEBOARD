/**
 * Task Form Page
 * Page for creating and editing tasks
 */

import { useParams, useNavigate } from 'react-router-dom';
import { TaskForm } from '@/components/tasks';
import { useTaskContext } from '@/contexts/TaskContext';
import { PageLoader } from '@/components/common/PageLoader';
import { useEffect, useState } from 'react';
import type { Task } from '@/types';

export default function TaskFormPage() {
  const { id: taskId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTask } = useTaskContext();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(!!taskId);

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const fetchedTask = await getTask(taskId);
          setTask(fetchedTask);
        } catch (error) {
          console.error('Failed to fetch task:', error);
          navigate('/tasks');
        } finally {
          setLoading(false);
        }
      };

      fetchTask();
    }
  }, [taskId, getTask, navigate]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-2xl">
      <TaskForm task={task as Task | undefined} onSuccess={() => navigate('/tasks')} />
    </div>
  );
}
