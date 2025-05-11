import { http, HttpResponse } from "msw";
import { type Task } from "../services/taskService";

let mockTasks: Task[] = [
  { id: 1, text: "Preloaded Task", done: false },
  { id: 2, text: "Completed Task", done: true },
];

export const handlers = [
  http.get("https://example.com/api/tasks", () => {
    return HttpResponse.json(mockTasks);
  }),

  http.post("https://example.com/api/tasks", async ({ request }) => {
    const { text } = (await request.json()) as Task;
    const newTask = {
      id: Math.floor(Math.random() * 10000),
      text,
      done: false,
    };
    mockTasks.push(newTask);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.post("https://example.com/api/tasks/:id/toggle", async ({ request }) => {
    const { id } = (await request.json()) as Task;
    mockTasks = mockTasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    return HttpResponse.json({}, { status: 200 });
  }),

  http.delete("https://example.com/api/tasks/:id", async ({ request }) => {
    const { id } = (await request.json()) as Task;
    mockTasks = mockTasks.filter((task) => task.id !== id);
    return HttpResponse.json({}, { status: 201 });
  }),
];
