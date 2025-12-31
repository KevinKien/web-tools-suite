import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface NavigationProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
}

export const Navigation = ({ items, activeItem, onItemClick }: NavigationProps) => {
  return (
    <nav className="flex flex-wrap gap-2 justify-center mb-8 p-2 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeItem === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
