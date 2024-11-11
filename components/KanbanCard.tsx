"use client"
import { Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';

interface KanbanCardProps {
  title: string;
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
}

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date | undefined;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ title, tasks, addTask, updateTask }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now(),
      title: taskTitle,
      description,
      dueDate,
    };
    addTask(newTask);
    setTaskTitle('');
    setDescription('');
    setDueDate(new Date());
    setOpen(false);
  };

  const handleEditTask = () => {
    if (currentTask) {
      const updatedTask: Task = {
        ...currentTask,
        title: taskTitle,
        description,
        dueDate,
      };
      updateTask(updatedTask);
      setTaskTitle('');
      setDescription('');
      setDueDate(new Date());
      setEditOpen(false);
    }
  };

  const handleCancel = () => {
    setTaskTitle('');
    setDescription('');
    setDueDate(new Date());
    setOpen(false);
    setEditOpen(false);
  };

  const openEditDialog = (task: Task) => {
    setCurrentTask(task);
    setTaskTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setEditOpen(true);
  };

  return (
    <div className='bg-gray-200 p-4 rounded-lg w-full md:w-1/3 lg:w-1/3'>
      <h3 className='scroll-m-20 text-lg font-semibold tracking-tight mb-5'>{title}</h3>
      <div className="mt-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-2 rounded-lg mb-2 cursor-pointer" onClick={() => openEditDialog(task)}>
            <h4 className="font-bold text-xl">{task.title}</h4>
            <p className="font-semibold text-md">{task.description}</p>
            <p className="text-sm text-gray-500">Due: {task.dueDate?.toLocaleDateString()}</p>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className='w-full'>
          <Button variant={'outline'} className='w-full'><Plus />Add New Task</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Add a new task to the {title} column.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-3">
              <Label htmlFor="task" className="text-right">
                Task
              </Label>
              <Input
                id="task"
                placeholder="Task title"
                className="col-span-2"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Complete College Assignment before due date."
                className="col-span-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <Label htmlFor="due-date" className="text-right">
                Due Date
              </Label>
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                className="rounded-md border col-span-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant={'outline'} onClick={handleCancel}>Cancel</Button>
            <Button type="button" onClick={handleAddTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update details of task in {title} column below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-center gap-3">
              <Label htmlFor="edit-task" className="text-right">
                Task
              </Label>
              <Input
                id="edit-task"
                placeholder="Task title"
                className="col-span-2"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                placeholder="Complete College Assignment before due date."
                className="col-span-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <Label htmlFor="edit-due-date" className="text-right">
                Due Date
              </Label>
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                className="rounded-md border col-span-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant={'outline'} onClick={handleCancel}>Cancel</Button>
            <Button type="button" onClick={handleEditTask}>Update Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanCard;