import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Regex, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const commonPatterns = [
  { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
  { name: "URL", pattern: "https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&'()*+,;=%]+" },
  { name: "Phone (US)", pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}" },
  { name: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b" },
  { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
  { name: "Hex Color", pattern: "#[0-9A-Fa-f]{6}\\b" },
  { name: "UUID", pattern: "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}" },
  { name: "Credit Card", pattern: "\\b(?:\\d{4}[- ]?){3}\\d{4}\\b" },
];

export const RegexTesterTool = () => {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [copied, setCopied] = useState(false);

  const flagString = useMemo(() => {
    return Object.entries(flags)
      .filter(([, enabled]) => enabled)
      .map(([flag]) => flag)
      .join("");
  }, [flags]);

  const { matches, highlightedText, error } = useMemo(() => {
    if (!pattern) {
      return { matches: [], highlightedText: testString, error: null };
    }

    try {
      const regex = new RegExp(pattern, flagString);
      const matchList: { match: string; index: number; groups?: Record<string, string> }[] = [];
      
      if (flags.g) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          matchList.push({
            match: match[0],
            index: match.index,
            groups: match.groups,
          });
          if (match[0].length === 0) regex.lastIndex++;
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matchList.push({
            match: match[0],
            index: match.index,
            groups: match.groups,
          });
        }
      }

      // Create highlighted text
      let highlighted = testString;
      if (matchList.length > 0) {
        const parts: { text: string; isMatch: boolean }[] = [];
        let lastIndex = 0;
        
        matchList.forEach(({ match, index }) => {
          if (index > lastIndex) {
            parts.push({ text: testString.slice(lastIndex, index), isMatch: false });
          }
          parts.push({ text: match, isMatch: true });
          lastIndex = index + match.length;
        });
        
        if (lastIndex < testString.length) {
          parts.push({ text: testString.slice(lastIndex), isMatch: false });
        }
        
        highlighted = parts
          .map((part) =>
            part.isMatch
              ? `<mark class="bg-primary/30 text-primary-foreground rounded px-0.5">${part.text}</mark>`
              : part.text
          )
          .join("");
      }

      return { matches: matchList, highlightedText: highlighted, error: null };
    } catch (err) {
      return { 
        matches: [], 
        highlightedText: testString, 
        error: err instanceof Error ? err.message : "Invalid regex" 
      };
    }
  }, [pattern, testString, flagString, flags.g]);

  const handleCopyPattern = async () => {
    if (!pattern) return;
    await navigator.clipboard.writeText(`/${pattern}/${flagString}`);
    setCopied(true);
    toast({ title: "Copied!", description: "Regex pattern copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTemplateClick = (templatePattern: string) => {
    setPattern(templatePattern);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Regex className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Regex Tester</CardTitle>
            <CardDescription>Test regex patterns with real-time matching</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common Patterns */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Common Patterns</Label>
          <div className="flex flex-wrap gap-1.5">
            {commonPatterns.map((template) => (
              <Badge
                key={template.name}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors text-xs"
                onClick={() => handleTemplateClick(template.pattern)}
              >
                {template.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Pattern Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="pattern">Pattern</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyPattern}
              disabled={!pattern}
              className="h-7 px-2"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">/</span>
            <Input
              id="pattern"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Enter regex pattern..."
              className={`font-mono text-sm ${error ? "border-destructive" : ""}`}
            />
            <span className="text-muted-foreground">/{flagString}</span>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        {/* Flags */}
        <div className="flex items-center gap-4">
          <Label className="text-sm text-muted-foreground">Flags:</Label>
          {[
            { key: "g", label: "Global (g)" },
            { key: "i", label: "Case Insensitive (i)" },
            { key: "m", label: "Multiline (m)" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <Checkbox
                id={`flag-${key}`}
                checked={flags[key as keyof typeof flags]}
                onCheckedChange={(checked) =>
                  setFlags((prev) => ({ ...prev, [key]: !!checked }))
                }
              />
              <Label htmlFor={`flag-${key}`} className="text-xs cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </div>

        {/* Test String */}
        <div className="space-y-2">
          <Label htmlFor="testString">Test String</Label>
          <Textarea
            id="testString"
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against the pattern..."
            className="font-mono text-sm min-h-[100px]"
          />
        </div>

        {/* Results */}
        {testString && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Matches</Label>
              <Badge variant="secondary">{matches.length} match{matches.length !== 1 ? "es" : ""}</Badge>
            </div>
            
            {/* Highlighted Preview */}
            <div
              className="p-3 rounded-md bg-muted/50 font-mono text-sm whitespace-pre-wrap break-all max-h-[150px] overflow-auto"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />

            {/* Match List */}
            {matches.length > 0 && (
              <div className="space-y-1 max-h-[120px] overflow-auto">
                {matches.slice(0, 20).map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs font-mono bg-muted/30 rounded px-2 py-1"
                  >
                    <span className="text-muted-foreground">#{idx + 1}</span>
                    <span className="text-primary">&quot;{m.match}&quot;</span>
                    <span className="text-muted-foreground">at index {m.index}</span>
                  </div>
                ))}
                {matches.length > 20 && (
                  <p className="text-xs text-muted-foreground">...and {matches.length - 20} more</p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
