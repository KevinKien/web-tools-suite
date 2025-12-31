import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Download, Copy } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const QRCodeTool = () => {
  const [text, setText] = useState("");

  const handleDownload = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = 256;
      canvas.height = 256;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("QR Code downloaded!");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleCopy = async () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = async () => {
      canvas.width = 256;
      canvas.height = 256;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          toast.success("QR Code copied to clipboard!");
        }
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <ToolCard
      title="QR Code Generator"
      description="Generate QR codes from any text or URL"
      icon={QrCode}
    >
      <div className="space-y-4">
        <textarea
          className="code-input w-full h-24"
          placeholder="Enter text or URL to generate QR code..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        {text && (
          <div className="flex flex-col items-center gap-4 p-6 bg-secondary/30 rounded-lg">
            <div className="p-4 bg-foreground rounded-lg">
              <QRCodeSVG
                id="qr-code"
                value={text}
                size={180}
                bgColor="hsl(210 20% 95%)"
                fgColor="hsl(220 20% 6%)"
                level="H"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  );
};
