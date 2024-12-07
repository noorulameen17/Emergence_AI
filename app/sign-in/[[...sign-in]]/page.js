"use client";
import { Box } from "@mui/material";
import { SignIn } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { svgBackground } from "../../svgBackground";

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: svgBackground,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <SignIn signUpUrl="/sign-up" afterSignInUrl="/generate" />
        </Box>
      </motion.div>
    </Box>
  );
}