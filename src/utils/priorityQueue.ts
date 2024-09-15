import { Task } from "../types";

export const priorityLevels = ["High", "Medium", "Low"];

export class PriorityQueue {
  private queue: Task[] = [];

  enqueue(task: Task) {
    this.queue.push(task);
    this.queue.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB || priorityLevels.indexOf(a.priority) - priorityLevels.indexOf(b.priority);
    });
  }

  getTasks(): Task[] {
    return [...this.queue];
  }
}
