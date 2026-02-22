type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({search, setSearch}: Props){
    return (
        <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
         className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
    );
}