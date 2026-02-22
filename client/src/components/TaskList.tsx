import TaskItem from "./TaskItem";
import type { Task } from "../types/task";

type Props={
    tasks: Task[];
    onDelete: (id:string)=>void;
    onToggle: (id:string)=>void;
}

export default function TaskList({tasks, onDelete, onToggle}:Props){
    if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">
        No tasks found. Add something productive to do!
      </div>
    );
  }
    return(
        <ul>
            {tasks.map(task=>(
                <TaskItem
                key={task.id}
                task={task}
                onDelete= {onDelete}
                onToggle= {onToggle}
                />
            ))}
        </ul>
    )
}