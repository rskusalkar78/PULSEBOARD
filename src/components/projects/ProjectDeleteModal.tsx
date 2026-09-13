import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, Button } from '@/components';
import type { ProjectWithDetails } from '@/types';

export interface ProjectDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  project: ProjectWithDetails | null;
  isDeleting?: boolean;
}

export const ProjectDeleteModal: React.FC<ProjectDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  project,
  isDeleting = false,
}) => {
  if (!project) return null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to permanently delete this project?
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 pt-2">
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="text-sm text-rose-900 dark:text-rose-200 space-y-1">
            <p className="font-semibold">Deleting &quot;{project.name}&quot;</p>
            <p className="text-xs opacity-90">
              All tasks, deadlines, and activity logs associated with this project will be deleted
              permanently.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="danger" loading={isDeleting} onClick={onConfirm}>
            Delete Project
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
