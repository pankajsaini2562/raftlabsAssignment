import { Task } from "../types";

class TreeNode {
  task: Task;
  left: TreeNode | null = null;
  right: TreeNode | null = null;

  constructor(task: Task) {
    this.task = task;
  }
}

export class BinarySearchTree {
  root: TreeNode | null = null;

  insert(task: Task) {
    const newNode = new TreeNode(task);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  private insertNode(node: TreeNode, newNode: TreeNode) {
    if (newNode.task.title < node.task.title) {
      if (!node.left) node.left = newNode;
      else this.insertNode(node.left, newNode);
    } else {
      if (!node.right) node.right = newNode;
      else this.insertNode(node.right, newNode);
    }
  }

  search(title: string): Task | null {
    return this.searchNode(this.root, title);
  }

  private searchNode(node: TreeNode | null, title: string): Task | null {
    if (node === null) return null;
    if (title < node.task.title) return this.searchNode(node.left, title);
    if (title > node.task.title) return this.searchNode(node.right, title);
    return node.task;
  }
}
