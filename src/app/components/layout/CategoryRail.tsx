interface CategoryRailProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryRail({ categories, selected, onSelect }: CategoryRailProps) {
  // Backend already seeds "All" as the first category (see Functions::fetchProduct) --
  // only add it ourselves if it's somehow missing.
  const options = categories.includes("All") ? categories : ["All", ...categories];

  return (
    <div className="py-3 overflow-x-auto">
      <div className="flex gap-2">
        {options.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
              selected === category
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
