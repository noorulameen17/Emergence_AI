"use client";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "../globals.css";
import { svgBackground } from "../svgBackground";
import { useAuth } from "@clerk/nextjs";

const DotStream = dynamic(() => import("../components/DotStream"), {
  ssr: false,
  loading: () => (
    <Box display="flex" justifyContent="center" alignItems="center"></Box>
  ),
});

const QuantumLoader = dynamic(() => import("../components/QuantumLoader"), {
  ssr: false,
  loading: () => (
    <Box display="flex" justifyContent="center" alignItems="center"></Box>
  ),
});

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Your Safety Is My Priority! How Can I Help You Today?",
    },
  ] );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef( null );
  const { isSignedIn } = useAuth();
  const router = useRouter();
  
   useEffect(() => {
     if (!isSignedIn) {
       router.push("/sign-in");
     }
   }, [isSignedIn, router]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: message },
    ]);

    setMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: message }],
        }),
      });

      if (!response.body) {
        throw new Error("ReadableStream not yet supported in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage += decoder.decode(value, { stream: true });
      }

      assistantMessage = assistantMessage
        .replace(/<strong>/g, "")
        .replace(/<\/strong>/g, "")
        .replace(/\\/g, "")
        .replace(/\*/g, "")
        .replace(
          /Before/g,
          '<span style="font-Family: AmericanPurpose; color: red">Before</span>'
        )
        .replace(
          /During/g,
          '<span style="font-Family: AmericanPurpose; color: green">During</span>'
        )
        .replace(
          /After/g,
          '<span style="font-Family: AmericanPurpose; color: blue">After</span>'
        );

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Oops, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      width="100%"
      height="98vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        backgroundImage: `url("data:image/svg+xml;utf8,${encodeURIComponent(
          svgBackground
        )}")`,
        backgroundSize: "cover",
      }}
    >
      <Box
        flexGrow={1}
        display="flex"
        justifyContent="center"
        paddingTop={"30px"}
        alignItems="center"
      >
        <Stack
          direction="column"
          width="1000px"
          height="500px"
          border="1px solid black"
          p={2}
          spacing={5}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((message, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Box
                  key={index}
                  display="flex"
                  justifyContent={
                    message.role === "assistant" ? "flex-start" : "flex-end"
                  }
                >
                  <Box
                    bgcolor={
                      message.role === "assistant" ? "#00acc1" : "#26a69a"
                    }
                    color="white"
                    fontFamily={"dynapuff"}
                    borderRadius={16}
                    p={3}
                    maxWidth="65%"
                    whiteSpace="pre-wrap"
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </Box>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </Stack>

          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <DotStream />
            </Box>
          )}

          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}

          <Stack direction="row" spacing={2}>
            <TextField
              label="Disaster Related Queries..."
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <IconButton
              onClick={sendMessage}
              disabled={loading}
              sx={{ color: "#00695c", "&:hover": { color: "#00897b" } }}
            >
              {loading ? (
                typeof window !== "undefined" ? (
                  <QuantumLoader />
                ) : null
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} />
              )}
            </IconButton>
          </Stack>
        </Stack>
      </Box>
      <footer>
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ padding: 2 }}
        >
          &copy; 2024 Emergence. All rights reserved.
        </Typography>
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
      </footer>
    </Box>
  );
}
