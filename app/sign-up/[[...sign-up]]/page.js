"use client";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { ShinyButton } from "@/components/ui/shiny-button";
import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Treadmill } from "ldrs/react";
import "ldrs/react/Treadmill.css";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const goHome = () => {
    setIsNavigating(true);
    router.push("/");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
      <div className="absolute inset-0">
        <BackgroundPaths position={1} />
        <BackgroundPaths position={-1} />
      </div>
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
        >
          <div className="max-w-md mx-auto rounded-lg shadow-[0px_0px_45px_rgba(0,0,0,0.1)] bg-white/10 backdrop-blur-sm">
            <SignUp
              signInUrl="/sign-in"
              afterSignInUrl="/generate"
              afterSignUpUrl="/generate"
              fallbackRedirectUrl="/generate"
              appearance={{ variables: { colorPrimary: "#000000" } }}
            />
          </div>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.7,
              ease: [0, 0.71, 0.2, 1.01],
            }}
          >
            <ShinyButton className="px-3 py-1.5 text-sm" onClick={goHome}>
              Go to Home
            </ShinyButton>
          </motion.div>
        </div>
      </div>

      {isNavigating && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-sm">
          <Treadmill size="70" speed="1.25" color="black" />
        </div>
      )}
    </div>
  );
}
