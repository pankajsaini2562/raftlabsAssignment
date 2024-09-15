import React, { useState } from "react";
import { Form, Input, Button, DatePicker, Select, Table, Space, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";
import { addTask, updateTask, deleteTask } from "./store";

import { Task } from "./types";
import { PriorityQueue } from "./utils/priorityQueue";
import { BinarySearchTree } from "./utils/binarySearchTree";

const { Option } = Select;

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const taskQueue = new PriorityQueue();
  tasks.forEach(task => taskQueue.enqueue(task));
  
  const taskBST = new BinarySearchTree();
  tasks.forEach(task => taskBST.insert(task));

  const onFinish = (values: any) => {
    const newTask: Task = {
      id: editingTask ? editingTask.id : tasks.length + 1,
      title: values.title,
      description: values.description,
      dueDate: values.dueDate.format("YYYY-MM-DD"),
      priority: values.priority,
      status: "in progress",
    };

    if (editingTask) {
      dispatch(updateTask(newTask));
      setEditingTask(null);
    } else {
      dispatch(addTask(newTask));
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteTask(id));
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const searchedTask = taskBST.search(searchTerm);

  const sortedTasks = taskQueue.getTasks();

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: string) => {
        let color = priority === "High" ? "red" : priority === "Medium" ? "orange" : "green";
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "completed" ? "green" : "blue"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Task) => (
        <Space>
          <Button onClick={() => handleEdit(record)} icon={<EditOutlined />} />
          <Button onClick={() => handleDelete(record.id)} icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl mb-5">Task Manager</h1>

      <Form layout="vertical" onFinish={onFinish} initialValues={editingTask || {}}>
        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter a title" }]}>
          <Input placeholder="Enter task title" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Enter task description" />
        </Form.Item>
        <Form.Item name="dueDate" label="Due Date" rules={[{ required: true, message: "Please select a due date" }]}>
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="priority" label="Priority" rules={[{ required: true, message: "Please select priority" }]}>
          <Select>
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          {editingTask ? "Update Task" : "Add Task"}
        </Button>
      </Form>

      <div className="mt-10">
        <Input placeholder="Search task by title" onChange={handleSearch} value={searchTerm} />
      </div>

      <Table className="mt-5" columns={columns} dataSource={searchedTask ? [searchedTask] : sortedTasks} rowKey="id" />
    </div>
  );
};

export default App;
