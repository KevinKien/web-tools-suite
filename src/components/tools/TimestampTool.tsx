import { useState } from "react";
import { Clock, Copy, ArrowDownUp, Calendar } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format, fromUnixTime, getUnixTime, parseISO } from "date-fns";

export const TimestampTool = () => {
  const [mode, setMode] = useState<"toDate" | "toTimestamp">("toDate");
  const [timestamp, setTimestamp] = useState("");
  const [dateString, setDateString] = useState("");
  const [result, setResult] = useState("");
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));

  const updateCurrentTimestamp = () => {
    setCurrentTimestamp(Math.floor(Date.now() / 1000));
  };

  const convertToDate = () => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        toast.error("Invalid timestamp");
        return;
      }
      
      // Check if milliseconds or seconds
      const date = ts > 9999999999 ? new Date(ts) : fromUnixTime(ts);
      
      const formatted = format(date, "yyyy-MM-dd HH:mm:ss");
      const iso = date.toISOString();
      const utc = date.toUTCString();
      
      setResult(`Local: ${formatted}\nISO: ${iso}\nUTC: ${utc}`);
      toast.success("Timestamp converted!");
    } catch (error) {
      toast.error("Invalid timestamp");
    }
  };

  const convertToTimestamp = () => {
    try {
      let date: Date;
      
      // Try parsing as ISO string first
      if (dateString.includes("T") || dateString.includes("-")) {
        date = parseISO(dateString);
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        toast.error("Invalid date");
        return;
      }
      
      const unixSeconds = getUnixTime(date);
      const unixMillis = date.getTime();
      
      setResult(`Seconds: ${unixSeconds}\nMilliseconds: ${unixMillis}`);
      toast.success("Date converted!");
    } catch (error) {
      toast.error("Invalid date");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  const useCurrentTimestamp = () => {
    updateCurrentTimestamp();
    setTimestamp(currentTimestamp.toString());
    setMode("toDate");
  };

  const useCurrentDate = () => {
    setDateString(new Date().toISOString());
    setMode("toTimestamp");
  };

  return (
    <ToolCard
      title="Timestamp Converter"
      description="Convert between Unix timestamp and human-readable date"
      icon={Clock}
    >
      <div className="space-y-4">
        <div className="p-3 bg-secondary/30 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Current Unix Timestamp</span>
            <p className="font-mono text-sm text-foreground">{currentTimestamp}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={updateCurrentTimestamp}>
            <ArrowDownUp className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Button
            variant={mode === "toDate" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("toDate")}
          >
            Timestamp → Date
          </Button>
          <Button
            variant={mode === "toTimestamp" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("toTimestamp")}
          >
            Date → Timestamp
          </Button>
        </div>

        {mode === "toDate" ? (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                className="code-input flex-1"
                placeholder="Enter Unix timestamp (seconds or ms)..."
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
              />
              <Button variant="outline" size="sm" onClick={useCurrentTimestamp}>
                Now
              </Button>
            </div>
            <Button variant="glow" onClick={convertToDate} className="w-full">
              <Calendar className="w-4 h-4" />
              Convert to Date
            </Button>
          </>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                type="text"
                className="code-input flex-1"
                placeholder="Enter date (ISO 8601 or readable format)..."
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
              />
              <Button variant="outline" size="sm" onClick={useCurrentDate}>
                Now
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Examples: 2024-01-15T12:30:00Z, Jan 15 2024 12:30:00
            </p>
            <Button variant="glow" onClick={convertToTimestamp} className="w-full">
              <Clock className="w-4 h-4" />
              Convert to Timestamp
            </Button>
          </>
        )}

        {result && (
          <div className="relative">
            <pre className="code-input w-full text-sm whitespace-pre-wrap">{result}</pre>
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
