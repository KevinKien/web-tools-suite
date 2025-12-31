import { useState } from "react";
import { KeyRound, Copy, Eye, EyeOff } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as jose from "jose";

export const JWTTool = () => {
  const [mode, setMode] = useState<"decode" | "create">("decode");
  const [jwtInput, setJwtInput] = useState("");
  const [decodedHeader, setDecodedHeader] = useState("");
  const [decodedPayload, setDecodedPayload] = useState("");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [generatedToken, setGeneratedToken] = useState("");

  const decodeJWT = () => {
    try {
      const parts = jwtInput.split(".");
      if (parts.length !== 3) {
        toast.error("Invalid JWT format");
        return;
      }

      const header = JSON.parse(atob(parts[0]));
      const payloadData = JSON.parse(atob(parts[1]));

      setDecodedHeader(JSON.stringify(header, null, 2));
      setDecodedPayload(JSON.stringify(payloadData, null, 2));
      toast.success("JWT decoded successfully!");
    } catch {
      toast.error("Failed to decode JWT");
    }
  };

  const createJWT = async () => {
    try {
      const payloadObj = JSON.parse(payload);
      const secretKey = new TextEncoder().encode(secret || "your-256-bit-secret");

      const token = await new jose.SignJWT(payloadObj)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .sign(secretKey);

      setGeneratedToken(token);
      toast.success("JWT created successfully!");
    } catch {
      toast.error("Invalid payload JSON");
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <ToolCard
      title="JWT Tool"
      description="Decode existing JWTs or create new ones"
      icon={KeyRound}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant={mode === "decode" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("decode")}
          >
            Decode
          </Button>
          <Button
            variant={mode === "create" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("create")}
          >
            Create
          </Button>
        </div>

        {mode === "decode" ? (
          <>
            <textarea
              className="code-input w-full h-24"
              placeholder="Paste your JWT token here..."
              value={jwtInput}
              onChange={(e) => setJwtInput(e.target.value)}
            />

            <Button variant="glow" onClick={decodeJWT} className="w-full">
              Decode JWT
            </Button>

            {(decodedHeader || decodedPayload) && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">Header</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(decodedHeader)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <pre className="code-input text-xs overflow-auto max-h-40">{decodedHeader}</pre>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">Payload</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(decodedPayload)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <pre className="code-input text-xs overflow-auto max-h-40">{decodedPayload}</pre>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Payload (JSON)</label>
              <textarea
                className="code-input w-full h-32"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Secret Key</label>
              <div className="relative">
                <input
                  type={showSecret ? "text" : "password"}
                  className="code-input w-full pr-10"
                  placeholder="Enter secret key (default: your-256-bit-secret)"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Button variant="glow" onClick={createJWT} className="w-full">
              Generate JWT
            </Button>

            {generatedToken && (
              <div className="relative">
                <textarea
                  className="code-input w-full h-24 text-xs"
                  value={generatedToken}
                  readOnly
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(generatedToken)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </ToolCard>
  );
};
