import { Header } from "@/components/Header";
import { QRCodeTool } from "@/components/tools/QRCodeTool";
import { URLEncoderTool } from "@/components/tools/URLEncoderTool";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { JWTTool } from "@/components/tools/JWTTool";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Developer <span className="text-primary glow-text">Toolkit</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Fast, secure, and easy-to-use tools for everyday development tasks.
            All processing happens in your browser.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          <QRCodeTool />
          <URLEncoderTool />
          <Base64Tool />
          <JWTTool />
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>All tools run entirely in your browser. No data is sent to any server.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
