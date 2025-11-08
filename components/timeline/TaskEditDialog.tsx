'use client';

import { useState } from 'react';
import { Task, PriorityLevel } from '@/types/shared';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface TaskEditDialogProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
  onSave: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export function TaskEditDialog({
  task,
  open,
  onClose,
  onSave,
  onDelete,
}: TaskEditDialogProps) {
  const [formData, setFormData] = useState<Partial<Task>>({});

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && task) {
      setFormData({
        title: task.title,
        time: task.time,
        duration: task.duration,
        priority: task.priority,
      });
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    if (task && formData) {
      onSave(task.id, formData);
      onClose();
    }
  };

  const handleDelete = () => {
    if (task && confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
      onClose();
    }
  };

  if (!task) return null;

  const priorityValue = formData.priority ?? task.priority;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              value={formData.title ?? task.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="time">Start Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time ?? task.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={formData.duration ?? task.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">
              Priority: {priorityValue.toFixed(1)} / 5.0
            </Label>
            <Slider
              id="priority"
              min={1}
              max={5}
              step={0.5}
              value={[priorityValue]}
              onValueChange={(values: number[]) =>
                setFormData({ ...formData, priority: values[0] as PriorityLevel })
              }
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">
              Higher priority tasks are highlighted more prominently
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="mr-auto"
          >
            Delete
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
