'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from './types';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState(''); // State for the input box

  // --- READ (Get all tasks) ---
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks/');
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- CREATE (Add a task) ---
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault(); // Stop form reload
    if (!newTaskTitle.trim()) return;

    try {
      await axios.post('http://127.0.0.1:8000/api/tasks/', {
        title: newTaskTitle,
        completed: false
      });
      setNewTaskTitle(''); // Clear input
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // --- UPDATE (Toggle Completed) ---
  const toggleTask = async (id: number, currentStatus: boolean) => {
    try {
      // Note the trailing slash at the end of the URL!
      await axios.patch(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        completed: !currentStatus
      });
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // --- DELETE (Remove task) ---
  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-black">My Django + Next.js Todo App</h1>
      
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-black">
        
        {/* CREATE FORM */}
        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Add a new task..."
            className="flex-1 p-2 border rounded border-gray-300"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add
          </button>
        </form>

        {/* LIST */}
        {loading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li 
                key={task.id} 
                className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 border border-gray-200"
              >
                {/* Checkbox + Title (Click to toggle) */}
                <div 
                  className="flex items-center gap-3 cursor-pointer flex-1"
                  onClick={() => toggleTask(task.id, task.completed)}
                >
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                    {task.completed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={task.completed ? "line-through text-gray-400" : "text-gray-800"}>
                    {task.title}
                  </span>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </li>
            ))}
            {tasks.length === 0 && (
              <p className="text-center text-gray-400 text-sm mt-4">No tasks yet. Add one above!</p>
            )}
          </ul>
        )}
      </div>
    </main>
  );
}