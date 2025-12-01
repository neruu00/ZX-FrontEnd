import { SearchIcon } from 'lucide-react';

export default function SearchField() {
  return (
    <div className="outline-brand/80 flex w-fit items-center rounded-full px-4 py-2 focus-within:gap-4 focus-within:outline-2">
      <label htmlFor="search">
        <SearchIcon size={18} />
      </label>
      <input
        id="search"
        className="w-0 grow opacity-0 transition-all duration-500 focus:w-[280px] focus:opacity-100 focus-visible:outline-0"
      />
    </div>
  );
}
