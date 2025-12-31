import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ListX, Copy, Trash2 } from "lucide-react";

export const RemoveDuplicatesTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [stats, setStats] = useState<{ original: number; unique: number; removed: number } | null>(null);

  const removeDuplicates = () => {
    if (!input.trim()) {
      toast.error("Please enter some text");
      return;
    }

    const lines = input.split("\n");
    const seen = new Set<string>();
    const uniqueLines: string[] = [];

    for (const line of lines) {
      let processedLine = trimWhitespace ? line.trim() : line;
      const compareKey = caseSensitive ? processedLine : processedLine.toLowerCase();

      if (!seen.has(compareKey)) {
        seen.add(compareKey);
        uniqueLines.push(trimWhitespace ? processedLine : line);
      }
    }

    const result = uniqueLines.join("\n");
    setOutput(result);
    setStats({
      original: lines.length,
      unique: uniqueLines.length,
      removed: lines.length - uniqueLines.length,
    });
    toast.success(`Removed ${lines.length - uniqueLines.length} duplicate lines`);
  };

  const copyOutput = () => {
    if (!output) {
      toast.error("No output to copy");
      return;
    }
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setStats(null);
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListX className="w-5 h-5 text-primary" />
          Remove Duplicates
        </CardTitle>
        <CardDescription>Remove duplicate lines from text</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input Text</label>
          <Textarea
            placeholder="Enter text with multiple lines..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-h-[150px] font-mono text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="caseSensitive"
              checked={caseSensitive}
              onCheckedChange={(checked) => setCaseSensitive(checked === true)}
            />
            <label htmlFor="caseSensitive" className="text-sm cursor-pointer">
              Case sensitive
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="trimWhitespace"
              checked={trimWhitespace}
              onCheckedChange={(checked) => setTrimWhitespace(checked === true)}
            />
            <label htmlFor="trimWhitespace" className="text-sm cursor-pointer">
              Trim whitespace
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={removeDuplicates} className="flex-1">
            <ListX className="w-4 h-4 mr-2" />
            Remove Duplicates
          </Button>
          <Button variant="outline" onClick={clearAll}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {stats && (
          <div className="flex gap-4 text-sm">
            <span className="text-muted-foreground">
              Original: <span className="text-foreground font-medium">{stats.original}</span>
            </span>
            <span className="text-muted-foreground">
              Unique: <span className="text-green-400 font-medium">{stats.unique}</span>
            </span>
            <span className="text-muted-foreground">
              Removed: <span className="text-red-400 font-medium">{stats.removed}</span>
            </span>
          </div>
        )}

        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Result</label>
              <Button variant="ghost" size="sm" onClick={copyOutput}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
            <Textarea
              value={output}
              readOnly
              className="min-h-[150px] font-mono text-sm bg-secondary/30"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RemoveDuplicatesTool;
