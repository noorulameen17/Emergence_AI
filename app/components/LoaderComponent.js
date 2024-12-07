"use client";
import { Box } from "@mui/material";
import { helix } from "ldrs";
import { useEffect, useState } from "react";

const LoaderComponent = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      helix.register();
    }
  }, []);

  if (!isClient) return null;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginTop: "-25px"}}>
      <l-helix size="45" speed="1.5" color="black"></l-helix>
    </Box>
  );
};

export default LoaderComponent;
