import { useState } from "react";
import { KeySquare, Copy, RefreshCw } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const PasswordGeneratorTool = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = "";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!charset) {
      toast.error("Please select at least one character type");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
    toast.success("Password generated!");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  const CheckboxOption = ({ 
    label, 
    checked, 
    onChange 
  }: { 
    label: string; 
    checked: boolean; 
    onChange: (checked: boolean) => void;
  }) => (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-border bg-secondary accent-primary"
      />
      {label}
    </label>
  );

  return (
    <ToolCard
      title="Password Generator"
      description="Generate secure random passwords"
      icon={KeySquare}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Length: {length}
          </label>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>8</span>
            <span>64</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3 bg-secondary/30 rounded-lg">
          <CheckboxOption
            label="Uppercase (A-Z)"
            checked={includeUppercase}
            onChange={setIncludeUppercase}
          />
          <CheckboxOption
            label="Lowercase (a-z)"
            checked={includeLowercase}
            onChange={setIncludeLowercase}
          />
          <CheckboxOption
            label="Numbers (0-9)"
            checked={includeNumbers}
            onChange={setIncludeNumbers}
          />
          <CheckboxOption
            label="Symbols (!@#$)"
            checked={includeSymbols}
            onChange={setIncludeSymbols}
          />
        </div>

        <Button variant="glow" onClick={generatePassword} className="w-full">
          <RefreshCw className="w-4 h-4" />
          Generate Password
        </Button>

        {password && (
          <div className="relative">
            <input
              type="text"
              className="code-input w-full pr-12 text-sm"
              value={password}
              readOnly
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2"
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
