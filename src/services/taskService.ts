export type Task = { id: number; text: string; done: boolean };

const BASE_URL = "https://example.com/api/tasks"; // placeholder

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch(BASE_URL);
  return res.json();
};

export const addTask = async (text: string): Promise<Task> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({ text, done: false }),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const toggleTask = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/${id}/toggle`, { method: "POST" });
};

export const deleteTask = async (id: number): Promise<void> => {
  await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
};
