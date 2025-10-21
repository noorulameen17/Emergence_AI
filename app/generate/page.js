"use client";

import { Starfield } from "@/components/ui/starfield-1";
import { useAuth, UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Treadmill } from "ldrs/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { AnimatedShinyButton } from "@/components/ui/animated-shiny-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  AlertTriangle,
  ArrowDown,
  CloudLightning,
  Droplets,
  Flame,
  Home,
  ShieldCheck,
  User,
} from "lucide-react";

export default function Chatbot() {
  const { user: clerkUser } = useUser();
  const { isSignedIn, isLoaded } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Your Safety Is My Priority! How Can I Help You Today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isNavigatingHome, setIsNavigatingHome] = useState(false);
  // Apply Clerk popover appearance only on mobile; restore defaults on desktop
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollAreaRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) router.push("/");
  }, [isLoaded, isSignedIn, router]);

  // Detect mobile viewport to scope Clerk dialog overrides to mobile only
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(max-width: 639px)");
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const decoratePhases = (text) =>
    text
      .replace(/<strong>/g, "")
      .replace(/<\/strong>/g, "")
      .replace(/\\/g, "")
      .replace(/\*/g, "")
      .replace(
        /Before/g,
        '<span style="font-weight:600;color:var(--destructive)">Before</span>'
      )
      .replace(
        /During/g,
        '<span style="font-weight:600;color:var(--primary)">During</span>'
      )
      .replace(
        /After/g,
        '<span style="font-weight:600;color:var(--accent-foreground)">After</span>'
      );

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setError(null);

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    const outgoing = message;
    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: outgoing }],
        }),
      });

      if (!response.body)
        throw new Error("ReadableStream not yet supported in this browser.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });
      }

      assistantMessage = decoratePhases(assistantMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (err) {
      console.error("[v0] Error sending message:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;
    const onScroll = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
      setShowScrollDown(!atBottom);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const quickPrompts = [
    {
      label: "Fire",
      icon: <Flame className="h-3.5 w-3.5 text-red-500" />,
      prompt: "fire safety plan",
      color: "red",
    },
    {
      label: "Flood",
      icon: <Droplets className="h-3.5 w-3.5 text-blue-500" />,
      prompt: "flood preparation",
      color: "blue",
    },
    {
      label: "Storm",
      icon: <CloudLightning className="h-3.5 w-3.5 text-gray-500" />,
      prompt: "storm shelter tips",
      color: "gray",
    },
    {
      label: "Emergency Kit",
      icon: <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />,
      prompt: "build emergency kit list",
      color: "yellow",
    },
  ];
  const setQuick = (p) => setMessage(p);

  const Typing = () => (
    <div className="flex items-center gap-2 px-2">
      <Avatar className="h-7 w-7 bg-primary/15 border border-primary/30 text-primary">
        <AvatarFallback className="bg-transparent">
          <Image
            src="/bot.jpeg"
            alt="Bot"
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
        </AvatarFallback>
      </Avatar>
      <div
        className="flex items-center gap-1 text-muted-foreground"
        aria-label="Assistant typing"
      >
        <motion.span
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
          className="h-1.5 w-1.5 rounded-full bg-current"
        />
        <motion.span
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.2,
          }}
          className="h-1.5 w-1.5 rounded-full bg-current"
        />
        <motion.span
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0.4,
          }}
          className="h-1.5 w-1.5 rounded-full bg-current"
        />
      </div>
    </div>
  );

  const bubbleVariants = {
    hidden: { opacity: 0, y: 6, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  const goHome = () => {
    setIsNavigatingHome(true);
    router.push("/");
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Emergence AI",
    applicationCategory: "CommunicationApplication",
    operatingSystem: "Web",
    description:
      "AI support for disaster preparedness and response. Step-by-step guidance during emergencies.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `${siteUrl}/generate`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Generate",
        item: `${siteUrl}/generate`,
      },
    ],
  };

  return (
    <TooltipProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col bg-background text-foreground"
      >
        {/* Full-screen starfield background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Starfield opacity={0.15} speed={1} quantity={600} />
        </div>

        <header className="sticky top-0 z-10 border-b border-border/60 backdrop-blur bg-background/80">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h1 className="text-sm sm:text-base md:text-xs lg:text-base font-semibold tracking-wide md:whitespace-nowrap md:truncate lg:whitespace-normal lg:overflow-visible lg:text-clip">
                Emergence • Disaster Assistant
              </h1>
              <Badge
                variant="outline"
                className="gap-1 border-green-500/30 text-green-600 dark:text-green-400"
                aria-label="Operational status"
              >
                <span className="relative inline-flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-500/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Online
              </Badge>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden md:flex md:flex-wrap md:max-w-[60vw] lg:max-w-none md:justify-end gap-1.5 lg:gap-2">
                {quickPrompts.map((q) => (
                  <motion.div
                    key={q.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuick(q.prompt)}
                      className={`md:h-7 lg:h-8 md:text-[11px] lg:text-sm md:px-2.5 lg:px-3 h-8 rounded-full border-${q.color}-500/70 text-${q.color}-700 hover:border-primary hover:bg-${q.color}-50`}
                    >
                      <span className="mr-1 md:mr-1 lg:mr-1.5 md:scale-90 lg:scale-100">
                        {q.icon}
                      </span>
                      {q.label}
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="ml-1 sm:ml-2 scale-90 sm:scale-100 origin-right shrink-0">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={
                    isMobile
                      ? {
                          elements: {
                            // Popover card sizing and scale (mobile only)
                            userButtonPopoverCard:
                              "w-[208px] p-2 scale-90 origin-top-right",
                            userButtonPopoverMain: "gap-1",
                            userButtonPopoverFooter: "text-[10px] py-1",
                            userButtonPopoverActionButton: "text-xs py-1.5",
                            // Shrink header/title/subtitle and avatar on mobile
                            userButtonPopoverTitle: "text-sm",
                            userButtonPopoverSubtitle: "text-xs",
                            userButtonPopoverAvatarBox: "h-8 w-8",
                            userButtonPopoverActionButtonIcon: "size-4",
                          },
                        }
                      : undefined
                  }
                />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-3 py-4 md:px-6 md:py-6">
          <div
            className="relative mx-auto flex max-w-5xl flex-col overflow-hidden rounded-xl border border-border/70 bg-background/60"
            style={{
              backgroundImage:
                "radial-gradient(700px 400px at 10% -10%, color-mix(in oklab, var(--primary) 15%, transparent) 0%, transparent 60%), radial-gradient(600px 380px at 100% 0%, color-mix(in oklab, var(--accent) 16%, transparent) 0%, transparent 60%)",
            }}
          >
            {/* Messages */}
            <ScrollArea
              ref={scrollAreaRef}
              className="h-[calc(72vh)] w-full p-3 md:p-4"
            >
              <div className="flex flex-col gap-3">
                {messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    variants={bubbleVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <div
                      className={`flex items-start gap-2 ${
                        m.role === "assistant" ? "justify-start" : "justify-end"
                      }`}
                    >
                      {m.role === "assistant" && (
                        <Avatar className="h-7 w-7 bg-primary/15 border border-primary/30 text-primary">
                          <AvatarFallback className="bg-transparent">
                            <Image
                              src="/bot.jpeg"
                              alt="Bot"
                              width={28}
                              height={28}
                              className="h-7 w-7 rounded-full object-cover"
                            />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[72%] rounded-2xl border px-3 py-2 text-[0.925rem] leading-relaxed md:px-4 md:py-2.5 ${
                          m.role === "assistant"
                            ? "border-primary/30 bg-primary/10"
                            : "border-accent/30 bg-accent/10"
                        }`}
                      >
                        <ReactMarkdown
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary underline underline-offset-2"
                              >
                                {children}
                              </a>
                            ),
                            p: ({ children }) => (
                              <p className="text-pretty text-foreground/90">
                                {children}
                              </p>
                            ),
                            li: ({ children }) => (
                              <li className="ml-4 list-disc text-foreground/90">
                                {children}
                              </li>
                            ),
                          }}
                        >
                          {m.content}
                        </ReactMarkdown>
                      </div>

                      {m.role === "user" && (
                        <Avatar className="h-7 w-7 border border-border/60 text-foreground/80">
                          <AvatarFallback className="bg-muted text-foreground/80">
                            {clerkUser?.profileImageUrl ||
                            clerkUser?.imageUrl ? (
                              <Image
                                src={
                                  clerkUser?.profileImageUrl ||
                                  clerkUser?.imageUrl
                                }
                                alt={clerkUser?.firstName || "User"}
                                width={28}
                                height={28}
                                unoptimized
                                className="h-7 w-7 rounded-full object-cover"
                              />
                            ) : (
                              <User className="h-3.5 w-3.5" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </motion.div>
                ))}

                {loading && <Typing />}

                {error && (
                  <p role="alert" className="px-1 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <Separator />

            {/* Composer */}
            <div className="w-full px-2.5 py-2 md:px-3">
              <div className="flex items-center gap-2">
                <PlaceholdersAndVanishInput
                  fullWidth
                  className="pl-2 pr-12"
                  placeholders={[
                    "Ask about fire, flood, storms…",
                    "Fire safety plan",
                    "Flood preparation",
                    "Storm shelter tips",
                    "Build an emergency kit list",
                  ]}
                  preset={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onSubmit={() => sendMessage()}
                />
              </div>
            </div>
          </div>

          {/* Scroll-to-bottom */}
          {showScrollDown && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Button
                onClick={scrollToBottom}
                variant="ghost"
                aria-label="Scroll to latest message"
                className="fixed bottom-24 right-6 rounded-full border border-primary/40 bg-background/80 text-primary hover:bg-primary/10"
                size="icon"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-20 border-t border-border/60 bg-background/80">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-3 sm:flex-row">
            <p className="text-[9px] sm:text-xs text-foreground/100">
              © 2025 Emergence. Responses May Be Imperfect - Always Follow
              Official Guidance
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="hidden"
            />
            {/* Use button variant to intercept click and show loader */}
            <AnimatedShinyButton
              className="rounded-xl"
              compactOnMobile
              onClick={goHome}
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </AnimatedShinyButton>
          </div>
        </footer>

        {isNavigatingHome && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm">
            <Treadmill size="70" speed="1.25" color="black" />
          </div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}
