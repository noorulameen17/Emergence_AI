"use client";
import { useState, useEffect, useRef } from "react";
import {
  Box,
  Stack,
  TextField,
  IconButton,
  CircularProgress,
  Typography,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useRouter } from "next/navigation";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Your Safety Is My Priority! How Can I Help You Today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();

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
  .replace(/Before/g, "<strong>Before</strong>")
  .replace(/During/g, "<strong>During</strong>")
  .replace(/After/g, "<strong>After</strong>");

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
    sx={{
      width:"100vw",
      height:"100vh",
      display:"flex",
      flexDirection:"column",
      justifyContent:"space-between",
      backgroundImage:"url('/image.png')",
      backgroundSize:'cover',
      alignItems:"center",
      }}
    >
      <Box
        
        flexGrow={ 1 }
        display="flex"
        justifyContent="center"
        paddingTop={'30px'}
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
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === "assistant" ? "flex-start" : "flex-end"
                }
              >
                <Box
                  bgcolor={message.role === "assistant" ? "#ff7043" : "#26a69a"}
                  color="white"
                  borderRadius={16}
                  p={3}
                  maxWidth="65%"
                  whiteSpace="pre-wrap"
                  dangerouslySetInnerHTML={{ __html: message.content }}
                />
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>

          {loading && (
            <Typography variant="body2" color="textSecondary">
              Assistant is typing...
            </Typography>
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
              variant="contained"
              onClick={sendMessage}
              disabled={loading}
              sx={{ color: "#009688", "&:hover": { color: "#4db6ac" } }}
            >
              {loading ? <CircularProgress size={24} /> : <SendIcon />}
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
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </Box>
      </footer>
    </Box>
  );
}
