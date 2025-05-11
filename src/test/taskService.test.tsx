import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  fetchTasks,
  addTask,
  toggleTask,
  deleteTask,
} from "../services/taskService";

// Create a mock of the global fetch function
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Task Service", () => {
  beforeEach(() => {
    // Reset mock before each test
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("fetchTasks should call the API and return tasks", async () => {
    const mockTasks = [
      { id: 1, text: "Task 1", done: false },
      { id: 2, text: "Task 2", done: true },
    ];

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockTasks),
    });

    const result = await fetchTasks();

    expect(mockFetch).toHaveBeenCalledWith("https://example.com/api/tasks");
    expect(result).toEqual(mockTasks);
  });

  it("addTask should POST to the API and return the new task", async () => {
    const newTask = { id: 3, text: "New Task", done: false };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(newTask),
    });

    const result = await addTask("New Task");

    expect(mockFetch).toHaveBeenCalledWith("https://example.com/api/tasks", {
      method: "POST",
      body: JSON.stringify({ text: "New Task", done: false }),
      headers: { "Content-Type": "application/json" },
    });
    expect(result).toEqual(newTask);
  });

  it("toggleTask should call the API with the correct ID", async () => {
    mockFetch.mockResolvedValueOnce({});

    await toggleTask(1);

    expect(mockFetch).toHaveBeenCalledWith(
      "https://example.com/api/tasks/1/toggle",
      { method: "POST" }
    );
  });

  it("deleteTask should call the API with the correct ID", async () => {
    mockFetch.mockResolvedValueOnce({});

    await deleteTask(1);

    expect(mockFetch).toHaveBeenCalledWith("https://example.com/api/tasks/1", {
      method: "DELETE",
    });
  });

  it("should handle fetch errors properly", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network Error"));

    await expect(fetchTasks()).rejects.toThrow("Network Error");
  });
});
