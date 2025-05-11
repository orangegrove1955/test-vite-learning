import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import * as taskService from "../services/taskService";

describe("App Component", () => {
  const mockTasks = [
    { id: 1, text: "Test Task 1", done: false },
    { id: 2, text: "Test Task 2", done: true },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();

    // Use spyOn to mock the implementations of the taskService functions
    vi.spyOn(taskService, "fetchTasks").mockResolvedValue([...mockTasks]);
    vi.spyOn(taskService, "addTask").mockImplementation(async (text) => ({
      id: Math.floor(Math.random() * 1000),
      text,
      done: false,
    }));
    vi.spyOn(taskService, "toggleTask").mockResolvedValue(undefined);
    vi.spyOn(taskService, "deleteTask").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the app title", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Task Tracker Lite")).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    render(<App />);
    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  it("displays tasks from API", async () => {
    render(<App />);

    await waitFor(() => {
      expect(taskService.fetchTasks).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    });
  });

  it("handles API error", async () => {
    // Override the mock implementation just for this test
    vi.spyOn(taskService, "fetchTasks").mockRejectedValueOnce(
      new Error("Failed to fetch")
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Failed to fetch/i)).toBeInTheDocument();
    });
  });

  it("adds a new task", async () => {
    vi.spyOn(taskService, "addTask").mockResolvedValueOnce({
      id: 3,
      text: "New Task",
      done: false,
    });

    render(<App />);

    // Wait for initial tasks to load
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    // Add a new task
    const input = screen.getByPlaceholderText("Add a task");
    const addButton = screen.getByText("Add");

    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(taskService.addTask).toHaveBeenCalledWith("New Task");
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });

  it("toggles a task", async () => {
    render(<App />);

    // Wait for initial tasks to load
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    // Find the first task and toggle it
    const taskItem = screen.getByText("Test Task 1").closest("div");
    expect(taskItem).not.toBeNull();

    fireEvent.click(taskItem as HTMLElement);

    await waitFor(() => {
      expect(taskService.toggleTask).toHaveBeenCalledWith(1);
    });
  });

  it("deletes a task", async () => {
    render(<App />);

    // Wait for initial tasks to load
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });

    // Find the delete button for the first task
    const deleteButtons = screen.getAllByText("X");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    });
  });

  it("matches snapshot", async () => {
    const { asFragment } = render(<App />);
    await screen.findByText(/Add/); // Wait until loading passes
    expect(asFragment()).toMatchSnapshot();
  });
});
