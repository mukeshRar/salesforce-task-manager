import { useState } from "react";
import { useMemo } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import useDebounce from "./hooks/useDebounce";
import "./App.css";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import useTasks from "./hooks/useTasks";
import useAuth from "./auth/useAuth";
import { login } from "./auth/login";

function App() {
  const { token, logout } = useAuth();
  const { tasks, addTask, deleteTask, toggleTask } = useTasks(token, logout);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "active">("all");
  const debouncedSearch = useDebounce(search, 300);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
      })
      .filter((task) =>
        task.title?.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
  }, [tasks, filter, debouncedSearch]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center p-4">
        <div className="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md text-center border border-white/20">
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 mb-8">
            Manage your Salesforce tasks seamlessly in one place.
          </p>

          <button
            onClick={login}
            className="group relative w-full flex justify-center items-center gap-3 bg-[#00A1E0] hover:bg-[#0087bb] text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl active:scale-95"
          >
            <img
              src="https://www.vectorlogo.zone/logos/salesforce/salesforce-icon.svg"
              alt="SF"
              className="w-6 h-6 bg-white rounded-full p-0.5"
            />
            Connect Salesforce
          </button>

          <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Secure OAuth 2.0 Connection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center items-start py-12 px-4">
      <div className="w-full max-w-2xl bg-white shadow-[0_20px_50px_rgba(8,_112,_184,_0.07)] rounded-[2.5rem] overflow-hidden border border-slate-100">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-100 p-8 pb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                My Tasks
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                Salesforce Sync Active
              </p>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 px-4 py-2 rounded-xl"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Total"
              value={totalTasks}
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <StatCard
              label="Active"
              value={activeTasks}
              color="text-amber-600"
              bg="bg-amber-50"
            />
            <StatCard
              label="Done"
              value={completedTasks}
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
          </div>
        </div>

        <div className="p-8 pt-6 space-y-6">
          <div className="bg-slate-50 p-2 rounded-2xl">
            <TaskForm onAdd={addTask} />
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <SearchBar search={search} setSearch={setSearch} />
            </div>
            <FilterBar filter={filter} setFilter={setFilter} />
          </div>

          <div className="min-h-[300px]">
            {tasks.length > 0 ? (
              <TaskList
                tasks={filteredTasks}
                onDelete={deleteTask}
                onToggle={toggleTask}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="font-medium">
                  No tasks found. Start by adding one!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Small Helper Component for Stats
  function StatCard({
    label,
    value,
    color,
    bg,
  }: {
    label: string;
    value: number;
    color: string;
    bg: string;
  }) {
    return (
      <div
        className={`${bg} rounded-2xl p-3 text-center transition-transform hover:scale-105 cursor-default`}
      >
        <p className={`text-2xl font-black ${color}`}>{value}</p>
        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
          {label}
        </p>
      </div>
    );
  }
}

export default App;
