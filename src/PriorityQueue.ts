export type Task = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  priority: number;
  status: 'completed' | 'in progress';
};

class PriorityQueue {
  tasks: Task[] = [];

  enqueue(task: Task) {
    this.tasks.push(task);
    this.tasks.sort((a, b) => {
      const dateDiff = a.dueDate.getTime() - b.dueDate.getTime();
      if (dateDiff === 0) {
        return b.priority - a.priority; // Higher priority first
      }
      return dateDiff; // Sort by date
    });
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  removeTask(id: number) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}

export default PriorityQueue;
