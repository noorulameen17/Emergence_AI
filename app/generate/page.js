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
import { ripples, quantum } from "ldrs";

ripples.register();
quantum.register();

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
  }, [ messages ] );
  
  const svgBackground = `
  <svg width="1000px" height="400px" id="svg" viewBox="0 100 790 300 790" xmlns="http://www.w3.org/2000/svg" class="transition duration-300 ease-in-out delay-150"><style>
          .path-0{
            animation:pathAnim-0 4s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          @keyframes pathAnim-0{
            0%{
              d: path("M 0,400 L 0,60 C 97.07142857142861,50.44642857142857 194.14285714285722,40.89285714285714 303,63 C 411.8571428571428,85.10714285714286 532.4999999999998,138.875 659,163 C 785.5000000000002,187.125 917.8571428571429,181.60714285714286 1049,197 C 1180.142857142857,212.39285714285714 1310.0714285714284,248.69642857142856 1440,285 L 1440,400 L 0,400 Z");
            }
            25%{
              d: path("M 0,400 L 0,60 C 134.75,44.767857142857146 269.5,29.535714285714292 393,50 C 516.5,70.46428571428571 628.75,126.625 725,153 C 821.25,179.375 901.5,175.96428571428572 1018,193 C 1134.5,210.03571428571428 1287.25,247.51785714285714 1440,285 L 1440,400 L 0,400 Z");
            }
            50%{
              d: path("M 0,400 L 0,60 C 112.82142857142858,52.732142857142854 225.64285714285717,45.46428571428571 331,63 C 436.35714285714283,80.53571428571429 534.25,122.87499999999997 668,157 C 801.75,191.12500000000003 971.3571428571429,217.03571428571433 1106,237 C 1240.642857142857,256.96428571428567 1340.3214285714284,270.98214285714283 1440,285 L 1440,400 L 0,400 Z");
            }
            75%{
              d: path("M 0,400 L 0,60 C 110.82142857142858,69.30357142857143 221.64285714285717,78.60714285714286 358,89 C 494.35714285714283,99.39285714285714 656.25,110.87499999999997 786,133 C 915.75,155.12500000000003 1013.3571428571429,187.89285714285717 1117,215 C 1220.642857142857,242.10714285714283 1330.3214285714284,263.55357142857144 1440,285 L 1440,400 L 0,400 Z");
            }
            100%{
              d: path("M 0,400 L 0,60 C 97.07142857142861,50.44642857142857 194.14285714285722,40.89285714285714 303,63 C 411.8571428571428,85.10714285714286 532.4999999999998,138.875 659,163 C 785.5000000000002,187.125 917.8571428571429,181.60714285714286 1049,197 C 1180.142857142857,212.39285714285714 1310.0714285714284,248.69642857142856 1440,285 L 1440,400 L 0,400 Z");
            }
          }</style><defs><linearGradient id="gradient" x1="90%" y1="20%" x2="10%" y2="80%"><stop offset="5%" stop-color="#0caba8"></stop><stop offset="95%" stop-color="#008f8c"></stop></linearGradient></defs><path d="M 0,400 L 0,60 C 97.07142857142861,50.44642857142857 194.14285714285722,40.89285714285714 303,63 C 411.8571428571428,85.10714285714286 532.4999999999998,138.875 659,163 C 785.5000000000002,187.125 917.8571428571429,181.60714285714286 1049,197 C 1180.142857142857,212.39285714285714 1310.0714285714284,248.69642857142856 1440,285 L 1440,400 L 0,400 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="0.265" class="transition-all duration-300 ease-in-out delay-150 path-0"></path><style>
          .path-1{
            animation:pathAnim-1 4s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          @keyframes pathAnim-1{
            0%{
              d: path("M 0,400 L 0,140 C 124.35714285714286,118.98214285714286 248.71428571428572,97.96428571428572 368,113 C 487.2857142857143,128.03571428571428 601.5,179.12500000000003 730,212 C 858.5,244.87499999999997 1001.2857142857142,259.5357142857143 1122,282 C 1242.7142857142858,304.4642857142857 1341.357142857143,334.7321428571429 1440,365 L 1440,400 L 0,400 Z");
            }
            25%{
              d: path("M 0,400 L 0,140 C 160.25,132.05357142857144 320.5,124.10714285714286 414,144 C 507.5,163.89285714285714 534.25,211.625 653,237 C 771.75,262.375 982.5,265.3928571428571 1129,283 C 1275.5,300.6071428571429 1357.75,332.80357142857144 1440,365 L 1440,400 L 0,400 Z");
            }
            50%{
              d: path("M 0,400 L 0,140 C 131.92857142857142,127.625 263.85714285714283,115.25 378,135 C 492.14285714285717,154.75 588.5,206.62499999999997 695,229 C 801.5,251.37500000000003 918.1428571428571,244.25 1044,262 C 1169.857142857143,279.75 1304.9285714285716,322.375 1440,365 L 1440,400 L 0,400 Z");
            }
            75%{
              d: path("M 0,400 L 0,140 C 136.25,124.16071428571428 272.5,108.32142857142857 374,115 C 475.5,121.67857142857143 542.2499999999999,150.875 675,189 C 807.7500000000001,227.125 1006.5,274.1785714285714 1145,305 C 1283.5,335.8214285714286 1361.75,350.41071428571433 1440,365 L 1440,400 L 0,400 Z");
            }
            100%{
              d: path("M 0,400 L 0,140 C 124.35714285714286,118.98214285714286 248.71428571428572,97.96428571428572 368,113 C 487.2857142857143,128.03571428571428 601.5,179.12500000000003 730,212 C 858.5,244.87499999999997 1001.2857142857142,259.5357142857143 1122,282 C 1242.7142857142858,304.4642857142857 1341.357142857143,334.7321428571429 1440,365 L 1440,400 L 0,400 Z");
            }
          }</style><defs><linearGradient id="gradient" x1="90%" y1="20%" x2="10%" y2="80%"><stop offset="5%" stop-color="#0caba8"></stop><stop offset="95%" stop-color="#008f8c"></stop></linearGradient></defs><path d="M 0,400 L 0,140 C 124.35714285714286,118.98214285714286 248.71428571428572,97.96428571428572 368,113 C 487.2857142857143,128.03571428571428 601.5,179.12500000000003 730,212 C 858.5,244.87499999999997 1001.2857142857142,259.5357142857143 1122,282 C 1242.7142857142858,304.4642857142857 1341.357142857143,334.7321428571429 1440,365 L 1440,400 L 0,400 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="0.4" class="transition-all duration-300 ease-in-out delay-150 path-1"></path><style>
          .path-2{
            animation:pathAnim-2 4s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          @keyframes pathAnim-2{
            0%{
              d: path("M 0,400 L 0,220 C 103.57142857142861,225.94642857142856 207.14285714285722,231.89285714285714 319,237 C 430.8571428571428,242.10714285714286 550.9999999999998,246.375 691,266 C 831.0000000000002,285.625 990.8571428571429,320.60714285714283 1119,353 C 1247.142857142857,385.39285714285717 1343.5714285714284,415.19642857142856 1440,445 L 1440,400 L 0,400 Z");
            }
            25%{
              d: path("M 0,400 L 0,220 C 139.10714285714283,201.625 278.21428571428567,183.25 399,204 C 519.7857142857143,224.75 622.2500000000001,284.625 734,314 C 845.7499999999999,343.375 966.7857142857142,342.25 1086,359 C 1205.2142857142858,375.75 1322.607142857143,410.375 1440,445 L 1440,400 L 0,400 Z");
            }
            50%{
              d: path("M 0,400 L 0,220 C 150.92857142857144,224.19642857142858 301.8571428571429,228.39285714285717 407,247 C 512.1428571428571,265.60714285714283 571.5000000000001,298.625 675,320 C 778.4999999999999,341.375 926.1428571428571,351.1071428571429 1061,370 C 1195.857142857143,388.8928571428571 1317.9285714285716,416.94642857142856 1440,445 L 1440,400 L 0,400 Z");
            }
            75%{
              d: path("M 0,400 L 0,220 C 157.03571428571428,201.875 314.07142857142856,183.75 421,192 C 527.9285714285714,200.25 584.7499999999999,234.875 706,269 C 827.2500000000001,303.125 1012.9285714285716,336.75 1146,366 C 1279.0714285714284,395.25 1359.5357142857142,420.125 1440,445 L 1440,400 L 0,400 Z");
            }
            100%{
              d: path("M 0,400 L 0,220 C 103.57142857142861,225.94642857142856 207.14285714285722,231.89285714285714 319,237 C 430.8571428571428,242.10714285714286 550.9999999999998,246.375 691,266 C 831.0000000000002,285.625 990.8571428571429,320.60714285714283 1119,353 C 1247.142857142857,385.39285714285717 1343.5714285714284,415.19642857142856 1440,445 L 1440,400 L 0,400 Z");
            }
          }</style><defs><linearGradient id="gradient" x1="90%" y1="20%" x2="10%" y2="80%"><stop offset="5%" stop-color="#0caba8"></stop><stop offset="95%" stop-color="#008f8c"></stop></linearGradient></defs><path d="M 0,400 L 0,220 C 103.57142857142861,225.94642857142856 207.14285714285722,231.89285714285714 319,237 C 430.8571428571428,242.10714285714286 550.9999999999998,246.375 691,266 C 831.0000000000002,285.625 990.8571428571429,320.60714285714283 1119,353 C 1247.142857142857,385.39285714285717 1343.5714285714284,415.19642857142856 1440,445 L 1440,400 L 0,400 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="0.53" class="transition-all duration-300 ease-in-out delay-150 path-2"></path><style>
          .path-3{
            animation:pathAnim-3 4s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }
          @keyframes pathAnim-3{
            0%{
              d: path("M 0,400 L 0,300 C 144.82142857142858,278.30357142857144 289.64285714285717,256.60714285714283 391,270 C 492.35714285714283,283.39285714285717 550.25,331.875 669,365 C 787.75,398.125 967.3571428571429,415.89285714285717 1106,440 C 1244.642857142857,464.10714285714283 1342.3214285714284,494.55357142857144 1440,525 L 1440,400 L 0,400 Z");
            }
            25%{
              d: path("M 0,400 L 0,300 C 111.5,293.69642857142856 223,287.39285714285717 350,299 C 477,310.60714285714283 619.5000000000001,340.12499999999994 754,366 C 888.4999999999999,391.87500000000006 1015,414.1071428571429 1128,440 C 1241,465.8928571428571 1340.5,495.44642857142856 1440,525 L 1440,400 L 0,400 Z");
            }
            50%{
              d: path("M 0,400 L 0,300 C 142.57142857142856,294.0892857142857 285.1428571428571,288.17857142857144 417,297 C 548.8571428571429,305.82142857142856 669.9999999999999,329.37500000000006 765,358 C 860.0000000000001,386.62499999999994 928.8571428571429,420.32142857142856 1037,449 C 1145.142857142857,477.67857142857144 1292.5714285714284,501.3392857142857 1440,525 L 1440,400 L 0,400 Z");
            }
            75%{
              d: path("M 0,400 L 0,300 C 92.39285714285714,296.7321428571429 184.78571428571428,293.4642857142857 318,300 C 451.2142857142857,306.5357142857143 625.25,322.875 754,350 C 882.75,377.125 966.2142857142858,415.0357142857143 1073,446 C 1179.7857142857142,476.9642857142857 1309.892857142857,500.9821428571429 1440,525 L 1440,400 L 0,400 Z");
            }
            100%{
              d: path("M 0,400 L 0,300 C 144.82142857142858,278.30357142857144 289.64285714285717,256.60714285714283 391,270 C 492.35714285714283,283.39285714285717 550.25,331.875 669,365 C 787.75,398.125 967.3571428571429,415.89285714285717 1106,440 C 1244.642857142857,464.10714285714283 1342.3214285714284,494.55357142857144 1440,525 L 1440,400 L 0,400 Z");
            }
          }</style><defs><linearGradient id="gradient" x1="90%" y1="20%" x2="10%" y2="80%"><stop offset="5%" stop-color="#0caba8"></stop><stop offset="95%" stop-color="#008f8c"></stop></linearGradient></defs><path d="M 0,400 L 0,300 C 144.82142857142858,278.30357142857144 289.64285714285717,256.60714285714283 391,270 C 492.35714285714283,283.39285714285717 550.25,331.875 669,365 C 787.75,398.125 967.3571428571429,415.89285714285717 1106,440 C 1244.642857142857,464.10714285714283 1342.3214285714284,494.55357142857144 1440,525 L 1440,400 L 0,400 Z" stroke="none" stroke-width="0" fill="url(#gradient)" fill-opacity="1" class="transition-all duration-300 ease-in-out delay-150 path-3"></path></svg>
`;


  return (
    <Box
      width="100vw"
      height="100vh"
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
             <Box display="flex" justifyContent="center" alignItems="center">
                 <l-quantum size="48" speed="1.5" color="black"></l-quantum>
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
              variant="contained"
              onClick={sendMessage}
              disabled={loading}
              sx={{ color: "#009688", "&:hover": { color: "#4db6ac" } }}
            >
              {loading ? (
                <l-ripples size="30" speed="1.5" color="black"></l-ripples>
              ) : (
                <SendIcon />
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
        <Box textAlign="center" mt={2}>
          <Button variant="outlined" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </Box>
      </footer>
    </Box>
  );
}
