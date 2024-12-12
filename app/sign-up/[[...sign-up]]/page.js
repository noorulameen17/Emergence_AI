"use client";
import { Box } from "@mui/material";
import { SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { svgBackground } from "../../svgBackground";

export default function SignUpPage() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "98vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
          svgBackground
        )}")`,
        backgroundSize: "cover",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
              svgBackground
            )}")`,
            backgroundSize: "cover",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0px 0px 45px rgba(0, 0, 0, 0.1)",
          }}
        >
          <SignUp signInUrl="/sign-in" fallbackRedirectUrl="/generate" />
        </Box>
      </motion.div>
    </Box>
  );
}