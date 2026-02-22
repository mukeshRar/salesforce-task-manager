import { useEffect, useState } from "react";
import type { Task } from "../types/task";

const BASE_URL = "http://localhost:4000/tasks"; 
// call backend and then backend calls Salesforce

type SalesforceTask = {
  Id: string;
  Title__c: string;
  Completed__c: boolean;
};

function mapTask(t: SalesforceTask): Task {
  return {
    id: t.Id,
    title: t.Title__c,
    completed: t.Completed__c
  };
}

export default function useTasks(token: string | null, logout: () => void) {
  const [tasks, setTasks] = useState<Task[]>([]);

  //Fetch only when token changes
  useEffect(() => {
    if (!token) return;

    fetch(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "x-instance-url": localStorage.getItem("sf_instance") || ""
      }
    })
      .then(async res => {
  if (res.status === 401) {
    logout();
    return [];
  }
  return res.json();
})
      .then((data: SalesforceTask[]) => {
        const mapped = data.map(mapTask);
        setTasks(mapped);
      })
      .catch(err => console.error("Error fetching tasks:", err));

  }, [token, logout]); // Add logout to dependencies since it's used in the catch block

  // --------------------------

async function addTask(title: string) {
  const res = await fetch("http://localhost:4000/tasks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-instance-url": localStorage.getItem("sf_instance") || ""
    },
    body: JSON.stringify({ title })
  });

  const data: SalesforceTask = await res.json();
  setTasks(prev => [mapTask(data), ...prev]);
}

  // --------------------------

  async function deleteTask(id: string) {
  await fetch(`http://localhost:4000/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-instance-url": localStorage.getItem("sf_instance") || ""
    }
  });

  setTasks(prev => prev.filter(t => t.id !== id));
}

  // --------------------------

 async function toggleTask(id: string) {
  const task = tasks.find(t => t.id === id);
  try{
  const res = await fetch(`http://localhost:4000/tasks/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-instance-url": localStorage.getItem("sf_instance") || ""
    },
    body: JSON.stringify({ completed: !task?.completed })
  });

 const updated: SalesforceTask = await res.json();
  setTasks(prev =>
    prev.map(t => (t.id === id ? mapTask(updated) : t))
  );} catch(err){
    setTasks(prev =>
    prev.map(t => (t.id === id ? { ...t, completed: t.completed } : t))
    );
    console.log("Error toggling task:", err);
  };
  }

  return { tasks, addTask, deleteTask, toggleTask };
}