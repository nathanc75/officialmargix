import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Sparkles,
  Bot,
  User,
  Minimize2,
  Lock,
  Crown
} from "lucide-react";
import { useDocumentChat, ChatMessage } from "@/hooks/useDocumentChat";
import { cn } from "@/lib/utils";

interface AIChatWidgetProps {
  documentContext?: {
    fileNames: string[];
    categories: Record<string, string[]>;
    analysisResults?: {
      totalLeaks: number;
      totalRecoverable: number;
      summary: string;
    };
  };
  locked?: boolean;
}

const quickSuggestions = [
  "What are the biggest issues found?",
  "How can I reduce my fees?",
  "Explain the duplicate charges",
  "What should I prioritize first?",
];

export function AIChatWidget({ documentContext, locked = false }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, isLoading, sendMessage, updateContext, hasContext } = useDocumentChat();

  useEffect(() => {
    if (documentContext) {
      updateContext(documentContext);
    }
  }, [documentContext, updateContext]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isLoading || locked) return;
    sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    if (locked) return;
    sendMessage(suggestion);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg border-0 z-50",
          locked ? "bg-muted hover:bg-muted/80" : "brand-gradient"
        )}
        size="icon"
        data-testid="chat-widget-button"
      >
        {locked ? (
          <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
        ) : (
          <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        )}
      </Button>
    );
  }

  return (
    <Card className="fixed inset-4 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[520px] shadow-2xl border-border z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <CardHeader className="p-3 sm:p-4 border-b border-border bg-card shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full brand-gradient flex items-center justify-center">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base">MARGIX Assistant</h3>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {hasContext ? "Ready to help with your analysis" : "Upload documents to get started"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-3 sm:p-4">
          {locked ? (
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />
              </div>
              <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">
                AI Assistant is a Premium Feature
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-[280px] mx-auto mb-3 sm:mb-4">
                Upgrade to get personalized insights, ask questions about your documents, and get AI-powered recommendations.
              </p>
              <Button className="brand-gradient border-0 text-sm" size="sm" asChild>
                <a href="/pricing">
                  <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                  Unlock with Premium
                </a>
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h4 className="font-medium text-foreground mb-2 text-sm sm:text-base">
                  Hi! I'm your AI assistant
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-[280px] mx-auto">
                  {hasContext 
                    ? "Ask me anything about your uploaded documents or analysis results."
                    : "Upload some documents first, then I can help you understand your financial data."}
                </p>
              </div>

              {hasContext && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground px-1">
                    Quick questions:
                  </p>
                  {quickSuggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3"
                      onClick={() => handleQuickSuggestion(suggestion)}
                    >
                      <span className="text-sm">{suggestion}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>
      </CardContent>

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-border bg-card shrink-0">
        {locked ? (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 sm:py-2.5">
            <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
            <span>Upgrade to Premium to chat with AI</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasContext ? "Ask about your documents..." : "Upload documents to chat..."}
              className="min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px] resize-none text-sm"
              disabled={!hasContext || isLoading}
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !hasContext || isLoading}
              size="icon"
              className="h-10 w-10 sm:h-11 sm:w-11 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isUser ? "bg-primary" : "bg-secondary"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className={cn(
        "max-w-[80%] rounded-2xl px-4 py-2.5",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary text-foreground"
      )}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

export default AIChatWidget;
