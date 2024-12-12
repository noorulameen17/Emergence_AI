"use client";
import { Box, Button } from "@mui/material";
import { SignIn } from "@clerk/nextjs";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { svgBackground } from "../../svgBackground";

export default function SignInPage() {
  const router = useRouter();
  
  const handleSignInSuccess = () => {
    router.push( "/generate" );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
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
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: {
                  backgroundColor: "#00695c",
                  "&:hover": {
                    backgroundColor: "#00897b",
                  },
                },
              },
            }}
            signUpUrl="/sign-up"
            onSuccess={handleSignInSuccess}
          />
        </Box>
      </motion.div>

      <Box textAlign="center" padding={3} mt={1}>
        <Button
          variant="outlined"
          onClick={() => router.push("/")}
          sx={{
            color: "white",
            borderColor: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(238, 100, 238, 0.1)",
              borderColor: "#0CABA8",
              boxShadow: "1px 3px 8px 5px #0CABA8",
            },
          }}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  );
}