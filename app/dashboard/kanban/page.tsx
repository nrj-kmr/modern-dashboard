"use client"

import React, { useEffect, useState } from 'react';
import KanbanCard from '@/components/KanbanCard';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date | undefined;
}

export default function Kanban() {
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  useEffect(() => {
    const storedTodoTasks = localStorage.getItem('todoTasks');
    const storedInProgressTasks = localStorage.getItem('inProgressTasks');
    const storedCompletedTasks = localStorage.getItem('completedTasks');

    if (storedTodoTasks) setTodoTasks(JSON.parse(storedTodoTasks));
    if (storedInProgressTasks) setInProgressTasks(JSON.parse(storedInProgressTasks));
    if (storedCompletedTasks) setCompletedTasks(JSON.parse(storedCompletedTasks));
  }, []);

  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(todoTasks));
  }, [todoTasks]);

  useEffect(() => {
    localStorage.setItem('inProgressTasks', JSON.stringify(inProgressTasks));
  }, [inProgressTasks]);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const addTodoTask = (task: Task) => setTodoTasks([...todoTasks, task]);
  const addInProgressTask = (task: Task) => setInProgressTasks([...inProgressTasks, task]);
  const addCompletedTask = (task: Task) => setCompletedTasks([...completedTasks, task]);

  const updateTask = (updatedTask: Task) => {
    const updateTasks = (tasks: Task[], setTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
      const updatedTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
      setTasks(updatedTasks);
    };

    updateTasks(todoTasks, setTodoTasks);
    updateTasks(inProgressTasks, setInProgressTasks);
    updateTasks(completedTasks, setCompletedTasks);
  };

  return (
    <div className='w-full'>
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight p-3">Kanban Board</h2>
      <div className='flex flex-col md:flex-row lg:flex-row md:space-x-4 lg:space-x-4 space-y-4 md:space-y-0 lg:space-y-0 m-5 justify-between'>
        <KanbanCard title="Todo" tasks={todoTasks} addTask={addTodoTask} updateTask={updateTask} />
        <KanbanCard title="In Progress" tasks={inProgressTasks} addTask={addInProgressTask} updateTask={updateTask} />
        <KanbanCard title="Completed" tasks={completedTasks} addTask={addCompletedTask} updateTask={updateTask} />
      </div>
    </div>
  );
}