import { useState } from "react";
import { FileDigit, Copy } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CryptoJS from "crypto-js";

export const MD5Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleHash = () => {
    if (!input.trim()) {
      toast.error("Please enter some text");
      return;
    }
    const hash = CryptoJS.MD5(input).toString();
    setOutput(hash);
    toast.success("MD5 hash generated!");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <ToolCard
      title="MD5 Hash"
      description="Generate MD5 hash from text"
      icon={FileDigit}
    >
      <div className="space-y-4">
        <textarea
          className="code-input w-full h-24"
          placeholder="Enter text to hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button variant="glow" onClick={handleHash} className="w-full">
          Generate MD5 Hash
        </Button>

        {output && (
          <div className="relative">
            <textarea
              className="code-input w-full h-16 text-sm"
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
