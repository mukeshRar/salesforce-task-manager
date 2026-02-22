import type { FilterType } from "../types/ui";

type Props = {
  filter: FilterType;
  setFilter: (value: FilterType) => void;
};

const filterOptions: FilterType[] = ["all", "active", "completed"];

export default function FilterBar({ filter, setFilter }: Props) {
  return (
    <div className="flex justify-center gap-3 mb-5">
      {filterOptions.map(type => (
        <button
          key={type}
          onClick={() => setFilter(type)}
          className={`px-4 py-1 rounded-xl text-sm font-medium transition ${
            filter === type
              ? "bg-blue-500 text-white shadow"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}