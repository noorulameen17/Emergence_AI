"use client";

import { cn } from "@/lib/utils";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Bot } from "lucide-react";
import { Space_Grotesk } from "next/font/google";
import local from "next/font/local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatedBadge } from "./ui/animated-badge";
import { AnimatedShinyButton } from "./ui/animated-shiny-button";
import IconRipple from "./ui/icon-ripple";
import { ShaderAnimation } from "./ui/shader-animation";
import { TextHoverEffect } from "./ui/text-hover-effect";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const satoshiLight = local({ src: "../public/font/Satoshi-Light.otf" });

export function Hero() {
  const { isSignedIn } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [ctaLoading, setCtaLoading] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener
      ? mql.addEventListener("change", update)
      : mql.addListener(update);
    return () => {
      mql.removeEventListener
        ? mql.removeEventListener("change", update)
        : mql.removeListener(update);
    };
  }, []);

  return (
    <section
      aria-labelledby="hero-title"
      className={cn(
        "relative isolate overflow-hidden",
        "px-6 md:px-10",
        "pt-10 md:pt-16 lg:pt-20",
        "pb-8 md:pb-12 lg:pb-16"
      )}
    >
      {/* Full-screen shader background */}
      <div className="fixed inset-0 -z-10">
        <ShaderAnimation />
      </div>

      {/* UserButton positioned in top right */}
      <div className="absolute top-4 right-4 z-10">
        <UserButton redirectUrl="/" />
      </div>

      {/* Ambient gradient orbs */}
      <div className="hero-orb" aria-hidden="true" />
      <div className="hero-orb-left" aria-hidden="true" />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Small empathetic badge */}
        <AnimatedBadge text="Emergence AI • Built for people" />

        {/* Top row: Avatar + Heading */}
        <div className="mt-6 flex flex-col w-full md:flex-row md:items-start md:justify-between gap-8">
          {/* Copy */}
          <div className="max-w-3xl">
            <h1
              id="hero-title"
              className={cn(
                spaceGrotesk.className,
                "text-balance",
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
                "font-semibold tracking-tight",
                "animate-fade-up",
                "text-white"
              )}
              style={{ lineHeight: 1.1 }}
            >
              AI Support When Every Second Counts
            </h1>

            <p
              className={cn(
                satoshiLight.className,
                "mt-5 md:mt-6",
                "text-lg md:text-xl text-muted-foreground max-w-2xl",
                "animate-fade-up"
              )}
              style={{ animationDelay: "120ms" }}
            >
              Get calm, step‑by‑step guidance during floods, earthquakes,
              wildfires, and more-so you can make safe, confident decisions in
              the moment.
            </p>
          </div>

          {/* Chatbot avatar with pulsing glow */}
          <div
            className="self-start md:self-auto animate-fade-up mt-6 md:mt-0"
            style={{ animationDelay: "140ms" }}
          >
            <div
              className={cn(
                "avatar-pulse",
                "relative rounded-2xl p-4 glass-card",
                "flex items-center gap-3"
              )}
              aria-label="AI assistant is ready to help"
            >
              <div
                className={cn(
                  "rounded-full p-3 bg-[color:var(--color-background)]",
                  "border",
                  "relative",
                  "-translate-x-3"
                )}
              >
                <IconRipple
                  icon={Bot}
                  iconSize={24}
                  iconColor="#ffffff"
                  borderColor="#22D3EE"
                  inset="7px"
                />
              </div>
              <Link href={isSignedIn ? "/generate" : "/sign-up"}>
                <span className="inline-block origin-right">
                  <AnimatedShinyButton
                    compactOnTablet
                    className="md:text-[0.95rem] md:min-w-[8.5rem] lg:text-base lg:min-w-0"
                    isLoading={ctaLoading}
                    onClick={() => setCtaLoading(true)}
                  >
                    Get Started
                  </AnimatedShinyButton>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 -bottom-6 sm:-bottom-20 z-30 md:z-50 h-24 sm:h-36 md:h-48 lg:h-56 xl:h-64 flex items-end justify-center pointer-events-none md:px-10">
        <div className="absolute inset-x-0 bottom-0 sm:static w-full h-full sm:h-full max-w-none sm:max-w-7xl px-0 sm:px-6 md:px-0 pb-0 pointer-events-auto overflow-visible scale-110 sm:scale-105 md:scale-95 lg:scale-110 origin-bottom sm:origin-center leading-none">
          <TextHoverEffect
            text="EMERGENCE"
            duration={0.15}
            yPercent={isMobile ? 100 : 50}
            baseline={isMobile ? "text-after-edge" : "middle"}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
