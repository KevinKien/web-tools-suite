import { useState } from "react";
import { Braces, Copy, Check, X, Minimize2, Maximize2 } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const JSONFormatterTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indentSize));
      setIsValid(true);
      toast.success("JSON formatted successfully!");
    } catch (error) {
      setIsValid(false);
      setOutput("");
      toast.error("Invalid JSON");
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setIsValid(true);
      toast.success("JSON minified successfully!");
    } catch (error) {
      setIsValid(false);
      setOutput("");
      toast.error("Invalid JSON");
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setIsValid(true);
      toast.success("Valid JSON!");
    } catch (error) {
      setIsValid(false);
      toast.error("Invalid JSON");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output || input);
    toast.success("Copied to clipboard!");
  };

  return (
    <ToolCard
      title="JSON Formatter"
      description="Format, validate, and minify JSON"
      icon={Braces}
    >
      <div className="space-y-4">
        <div className="relative">
          <textarea
            className="code-input w-full h-32"
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsValid(null);
            }}
          />
          {isValid !== null && (
            <div className={`absolute top-2 right-2 p-1 rounded ${isValid ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"}`}>
              {isValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Indent:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
              className="code-input px-2 py-1 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>1 tab</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="glow" onClick={formatJSON} className="flex-1">
            <Maximize2 className="w-4 h-4" />
            Beautify
          </Button>
          <Button variant="outline" onClick={minifyJSON} className="flex-1">
            <Minimize2 className="w-4 h-4" />
            Minify
          </Button>
          <Button variant="outline" onClick={validateJSON}>
            <Check className="w-4 h-4" />
            Validate
          </Button>
        </div>

        {output && (
          <div className="relative">
            <pre className="code-input w-full max-h-64 overflow-auto text-xs whitespace-pre-wrap">
              {output}
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
