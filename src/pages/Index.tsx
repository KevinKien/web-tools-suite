import { useState } from "react";
import { 
  QrCode, Link, Binary, KeyRound, Hash, FileDigit, KeySquare,
  Fingerprint, Braces, Clock, LayoutGrid
} from "lucide-react";
import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { QRCodeTool } from "@/components/tools/QRCodeTool";
import { URLEncoderTool } from "@/components/tools/URLEncoderTool";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { JWTTool } from "@/components/tools/JWTTool";
import { SHA256Tool } from "@/components/tools/SHA256Tool";
import { MD5Tool } from "@/components/tools/MD5Tool";
import { PasswordGeneratorTool } from "@/components/tools/PasswordGeneratorTool";
import { UUIDTool } from "@/components/tools/UUIDTool";
import { JSONFormatterTool } from "@/components/tools/JSONFormatterTool";
import { TimestampTool } from "@/components/tools/TimestampTool";

const navItems = [
  { id: "qrcode", label: "QR Code", icon: QrCode },
  { id: "url", label: "URL", icon: Link },
  { id: "base64", label: "Base64", icon: Binary },
  { id: "jwt", label: "JWT", icon: KeyRound },
  { id: "sha256", label: "SHA256", icon: Hash },
  { id: "md5", label: "MD5", icon: FileDigit },
  { id: "password", label: "Password", icon: KeySquare },
  { id: "uuid", label: "UUID", icon: Fingerprint },
  { id: "json", label: "JSON", icon: Braces },
  { id: "timestamp", label: "Timestamp", icon: Clock },
];

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const renderTools = () => {
    if (activeCategory === "all") {
      return (
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          <QRCodeTool />
          <URLEncoderTool />
          <Base64Tool />
          <JWTTool />
          <SHA256Tool />
          <MD5Tool />
          <PasswordGeneratorTool />
          <UUIDTool />
          <JSONFormatterTool />
          <TimestampTool />
        </div>
      );
    }

    const toolComponents: Record<string, JSX.Element> = {
      qrcode: <QRCodeTool />,
      url: <URLEncoderTool />,
      base64: <Base64Tool />,
      jwt: <JWTTool />,
      sha256: <SHA256Tool />,
      md5: <MD5Tool />,
      password: <PasswordGeneratorTool />,
      uuid: <UUIDTool />,
      json: <JSONFormatterTool />,
      timestamp: <TimestampTool />,
    };

    return (
      <div className="max-w-2xl mx-auto">
        {toolComponents[activeCategory]}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Developer <span className="text-primary glow-text">Toolkit</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Fast, secure, and easy-to-use tools for everyday development tasks.
            All processing happens in your browser.
          </p>
        </div>

        <Navigation 
          items={[{ id: "all", label: "All Tools", icon: LayoutGrid }, ...navItems]}
          activeItem={activeCategory}
          onItemClick={setActiveCategory}
        />

        {renderTools()}

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>All tools run entirely in your browser. No data is sent to any server.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
