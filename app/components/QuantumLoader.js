"use client";
import { Box } from "@mui/material";
import { quantum } from "ldrs";
import { useEffect, useState } from "react";

const QuantumLoader = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      quantum.register();
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
      <l-quantum size="45" speed="1.5" color="black"></l-quantum>
    </Box>
  );
};

export default QuantumLoader;
