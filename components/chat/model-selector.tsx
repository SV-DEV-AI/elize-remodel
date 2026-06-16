"use client";

import { useConfig } from "@/hooks/use-config";
import { ProviderType } from "@/lib/providers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bot, Sparkles, Cpu } from "lucide-react";

const PROVIDERS: { value: ProviderType; label: string; icon: any; models: { id: string; name: string }[] }[] = [
  {
    value: "gemini",
    label: "Google",
    icon: Sparkles,
    models: [
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
      { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
      { id: "gemini-2.0-flash-latest", name: "Gemini 2.0 Flash (Latest)" },
      { id: "gemini-pro", name: "Gemini 1.0 Pro (Legacy)" },
    ],
  },
  {
    value: "openai",
    label: "OpenAI",
    icon: Bot,
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    ],
  },
  {
    value: "anthropic",
    label: "Anthropic",
    icon: Cpu,
    models: [
      { id: "claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet" },
      { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
      { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
    ],
  },
];

export function ModelSelector() {
  const { config, setConfig } = useConfig();

  // Find current provider to get its models
  const currentProvider = PROVIDERS.find((p) => p.value === config.provider) || PROVIDERS[0];
  
  // Verify selected model exists in current provider, otherwise fallback to first
  const isValidModel = currentProvider.models.some((m) => m.id === config.model);
  const displayModel = isValidModel ? config.model : currentProvider.models[0].id;

  const handleProviderChange = (newProviderValue: ProviderType | null) => {
    if (!newProviderValue) return;
    const provider = PROVIDERS.find((p) => p.value === newProviderValue)!;
    setConfig({ provider: newProviderValue, model: provider.models[0].id });
  };

  const handleModelChange = (newModelValue: string | null) => {
    if (!newModelValue) return;
    setConfig({ model: newModelValue });
  };

  const Icon = currentProvider.icon;

  return (
    <div className="flex items-center gap-2">
      <Select value={config.provider} onValueChange={handleProviderChange}>
        <SelectTrigger className="w-[140px] h-9 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-indigo-400" />
            <SelectValue placeholder="Provider" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 text-white">
          {PROVIDERS.map((provider) => {
            const PIcon = provider.icon;
            return (
              <SelectItem key={provider.value} value={provider.value} className="focus:bg-white/10 focus:text-white">
                <div className="flex items-center gap-2">
                  <PIcon className="w-4 h-4 text-muted-foreground" />
                  {provider.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select value={displayModel} onValueChange={handleModelChange}>
        <SelectTrigger className="w-[200px] h-9 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
          <SelectValue placeholder="Model" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-950 border-white/10 text-white">
          <SelectGroup>
            <SelectLabel className="text-xs text-muted-foreground">{currentProvider.label} Models</SelectLabel>
            {currentProvider.models.map((model) => (
              <SelectItem key={model.id} value={model.id} className="focus:bg-white/10 focus:text-white">
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
