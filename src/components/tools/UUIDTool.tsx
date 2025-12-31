import { useState } from "react";
import { Fingerprint, Copy, RefreshCw, Plus } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v1 as uuidv1, v4 as uuidv4 } from "uuid";

export const UUIDTool = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [version, setVersion] = useState<"v1" | "v4">("v4");
  const [count, setCount] = useState(1);

  const generateUUIDs = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(version === "v4" ? uuidv4() : uuidv1());
    }
    setUuids(newUuids);
    toast.success(`Generated ${count} UUID${count > 1 ? "s" : ""}!`);
  };

  const handleCopy = async (uuid: string) => {
    await navigator.clipboard.writeText(uuid);
    toast.success("Copied to clipboard!");
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.join("\n"));
    toast.success("All UUIDs copied to clipboard!");
  };

  return (
    <ToolCard
      title="UUID Generator"
      description="Generate unique identifiers (v1 or v4)"
      icon={Fingerprint}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={version === "v4" ? "default" : "outline"}
              size="sm"
              onClick={() => setVersion("v4")}
            >
              UUID v4
            </Button>
            <Button
              variant={version === "v1" ? "default" : "outline"}
              size="sm"
              onClick={() => setVersion("v1")}
            >
              UUID v1
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Count:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
            className="code-input w-20 text-center"
          />
        </div>

        <Button variant="glow" onClick={generateUUIDs} className="w-full">
          <RefreshCw className="w-4 h-4" />
          Generate UUID{count > 1 ? "s" : ""}
        </Button>

        {uuids.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Generated UUIDs ({uuids.length})
              </span>
              {uuids.length > 1 && (
                <Button variant="ghost" size="sm" onClick={handleCopyAll}>
                  <Copy className="w-3 h-3 mr-1" />
                  Copy All
                </Button>
              )}
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 p-2 bg-secondary/30 rounded-lg">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 bg-secondary/50 rounded hover:bg-secondary transition-colors group"
                >
                  <code className="text-xs font-mono text-foreground">{uuid}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleCopy(uuid)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
