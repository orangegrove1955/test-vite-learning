import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import {
  addTask,
  deleteTask,
  fetchTasks,
  toggleTask,
  type Task,
} from "./services/taskService";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks()
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddTask = async () => {
    if (!input.trim()) return;
    try {
      const newTask = await addTask(input);
      setTasks((prev) => [...prev, newTask]);
      setInput("");
    } catch (err) {
      console.error(err);
      alert("Failed to add task");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleTask(id);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
      );
    } catch {
      alert("Failed to toggle task");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      alert("Failed to delete task");
    }
  };

  if (loading) return <p className="p-4">Loading tasks...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-4 space-y-4">
      <h1 className="text-2xl font-bold">Task Tracker Lite</h1>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task"
        />
        <Button onClick={handleAddTask}>Add</Button>
      </div>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-3 border rounded"
          >
            <div
              className="flex gap-2 items-center  cursor-pointer"
              onClick={() => handleToggle(task.id)}
            >
              <Checkbox id={`check-${task.id}`} checked={task.done} />
              <label htmlFor={`check-${task.id}`}>
                <span
                  className={`${task.done ? "line-through text-gray-500" : ""}`}
                >
                  {task.text}
                </span>
              </label>
            </div>

            <Button variant="destructive" onClick={() => handleDelete(task.id)}>
              X
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
