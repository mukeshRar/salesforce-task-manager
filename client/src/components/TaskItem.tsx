import type { Task } from "../types/task";

type Props= {
    task: Task;
    onDelete: (id:string)=>void;
    onToggle: (id:string)=>void;
}
export default function TaskItem({task, onDelete, onToggle}:Props){
    return (
        <li className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl mb-3 shadow-sm hover:shadow-md transition transform hover:scale-[1.01]">
            <div className="flex items-center gap-3">
            <input type="checkbox"
            checked={task.completed}
            onChange={()=>onToggle(task.id)}
            className="w-4 h-4 accent-blue-500"
            />

            <span className={`text-gray-700 ${
        task.completed ? "line-through text-gray-400" : ""
      }`}>{task.title}</span>
        </div>
            <button className="text-red-500 hover:text-red-700 text-sm font-medium transition"
             onClick={()=>onDelete(task.id)}>Delete</button>
        </li>
    )
}