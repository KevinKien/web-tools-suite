import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GitCompare, Copy } from "lucide-react";

export const TextDiffTool = () => {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diffResult, setDiffResult] = useState<{ type: string; value: string }[]>([]);

  const computeDiff = () => {
    if (!text1 && !text2) {
      toast.error("Please enter text in both fields");
      return;
    }

    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const result: { type: string; value: string }[] = [];

    const maxLen = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i];
      const line2 = lines2[i];

      if (line1 === undefined && line2 !== undefined) {
        result.push({ type: "added", value: line2 });
      } else if (line2 === undefined && line1 !== undefined) {
        result.push({ type: "removed", value: line1 });
      } else if (line1 === line2) {
        result.push({ type: "same", value: line1 });
      } else {
        result.push({ type: "removed", value: line1 });
        result.push({ type: "added", value: line2 });
      }
    }

    setDiffResult(result);
    toast.success("Diff computed");
  };

  const copyDiff = () => {
    const text = diffResult
      .map((d) => {
        if (d.type === "added") return `+ ${d.value}`;
        if (d.type === "removed") return `- ${d.value}`;
        return `  ${d.value}`;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Diff copied to clipboard");
  };

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <GitCompare className="w-5 h-5 text-primary" />
          Text Diff
        </CardTitle>
        <CardDescription>Compare two texts and see differences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Original Text</label>
            <Textarea
              placeholder="Enter original text..."
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Modified Text</label>
            <Textarea
              placeholder="Enter modified text..."
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
          </div>
        </div>

        <Button onClick={computeDiff} className="w-full">
          <GitCompare className="w-4 h-4 mr-2" />
          Compare
        </Button>

        {diffResult.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Diff Result</label>
              <Button variant="ghost" size="sm" onClick={copyDiff}>
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>
            <div className="bg-secondary/30 rounded-lg p-4 font-mono text-sm overflow-auto max-h-[300px] border border-border">
              {diffResult.map((diff, index) => (
                <div
                  key={index}
                  className={`px-2 py-0.5 ${
                    diff.type === "added"
                      ? "bg-green-500/20 text-green-400"
                      : diff.type === "removed"
                      ? "bg-red-500/20 text-red-400"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="select-none mr-2">
                    {diff.type === "added" ? "+" : diff.type === "removed" ? "-" : " "}
                  </span>
                  {diff.value || " "}
                </div>
              ))}
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500/20 rounded" /> Added
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500/20 rounded" /> Removed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-secondary/50 rounded" /> Unchanged
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TextDiffTool;
