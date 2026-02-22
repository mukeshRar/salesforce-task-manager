import { useState } from "react";

type Props= {
    onAdd: (title: string)=>void
}

export default function TaskForm({onAdd}: Props){
    const [title, setTitle]= useState("");

    function handleSubmit(e: React.SubmitEvent){
        e.preventDefault();

        if(!title.trim()) return;
        
        onAdd(title);
        setTitle("");
    }

    return(
        <form onSubmit={handleSubmit}  className="flex gap-2 mb-4">
            <input 
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            placeholder="Enter Task..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button className="bg-blue-500 text-white px-5 py-2 rounded-xl hover:bg-blue-600 active:scale-95 transition">Add</button>
        </form>
    )
}