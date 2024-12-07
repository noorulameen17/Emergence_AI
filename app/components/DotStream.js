"use client";
import { Box } from "@mui/material";
import { dotStream } from "ldrs";
import { useEffect, useState } from "react";

const DotStream = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      dotStream.register();
    }
  }, []);

  if (!isClient) return null;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ marginTop: "-25px" }}
    >
      <l-dot-stream size="45" speed="1.5" color="black"></l-dot-stream>
    </Box>
  );
};

export default DotStream;
