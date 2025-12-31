import { Wrench } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary animate-glow">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground glow-text">DevTools</h1>
            <p className="text-xs text-muted-foreground">Essential utilities for developers</p>
          </div>
        </div>
      </div>
    </header>
  );
};
