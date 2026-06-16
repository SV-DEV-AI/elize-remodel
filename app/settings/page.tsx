"use client";

import { useConfig } from "@/hooks/use-config";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { KeyRound, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const { config, setConfig } = useConfig();
  
  const [keys, setKeys] = useState({
    openaiKey: config.openaiKey,
    anthropicKey: config.anthropicKey,
    geminiKey: config.geminiKey,
  });

  const handleSave = () => {
    setConfig({
      openaiKey: keys.openaiKey,
      anthropicKey: keys.anthropicKey,
      geminiKey: keys.geminiKey,
    });
    toast.success("Settings saved", {
      description: "Your API keys have been securely stored in your browser.",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your API keys to use different AI providers. Keys are stored locally in your browser and are never saved to our servers.
          </p>
        </div>

        <div className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-medium">Provider API Keys</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai">OpenAI API Key (Starts with sk-)</Label>
              <div className="flex gap-2">
                <Input
                  id="openai"
                  type="password"
                  placeholder="sk-..."
                  value={keys.openaiKey}
                  onChange={(e) => setKeys({ ...keys, openaiKey: e.target.value })}
                  className="bg-black/20 border-white/10 focus-visible:ring-indigo-500"
                />
                {config.openaiKey && <CheckCircle2 className="w-5 h-5 text-green-500 self-center shrink-0" />}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropic">Anthropic API Key (Starts with sk-ant-)</Label>
              <div className="flex gap-2">
                <Input
                  id="anthropic"
                  type="password"
                  placeholder="sk-ant-..."
                  value={keys.anthropicKey}
                  onChange={(e) => setKeys({ ...keys, anthropicKey: e.target.value })}
                  className="bg-black/20 border-white/10 focus-visible:ring-indigo-500"
                />
                {config.anthropicKey && <CheckCircle2 className="w-5 h-5 text-green-500 self-center shrink-0" />}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gemini">Google Gemini API Key (Starts with AIza)</Label>
              <div className="flex gap-2">
                <Input
                  id="gemini"
                  type="password"
                  placeholder="AIza..."
                  value={keys.geminiKey}
                  onChange={(e) => setKeys({ ...keys, geminiKey: e.target.value })}
                  className="bg-black/20 border-white/10 focus-visible:ring-indigo-500"
                />
                {config.geminiKey && <CheckCircle2 className="w-5 h-5 text-green-500 self-center shrink-0" />}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} className="bg-white text-black hover:bg-zinc-200">
              Save Keys
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
