import { useState } from "react";
import { Binary, ArrowDownUp, Copy } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Base64Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const handleProcess = () => {
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
        toast.success("Base64 encoded successfully!");
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
        toast.success("Base64 decoded successfully!");
      }
    } catch {
      toast.error("Invalid input for " + mode);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const toggleMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput("");
    setOutput("");
  };

  return (
    <ToolCard
      title="Base64 Encoder / Decoder"
      description="Encode or decode Base64 strings"
      icon={Binary}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant={mode === "encode" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("encode")}
          >
            Encode
          </Button>
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("decode")}
          >
            Decode
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleMode}>
            <ArrowDownUp className="w-4 h-4" />
          </Button>
        </div>

        <textarea
          className="code-input w-full h-24"
          placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 string to decode..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button variant="glow" onClick={handleProcess} className="w-full">
          {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
        </Button>

        {output && (
          <div className="relative">
            <textarea
              className="code-input w-full h-24"
              value={output}
              readOnly
            />
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
