import { useState } from "react";

export function useShareUrlViewModel() {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(currentUrl)}`;

  const toggleQrCode = () => {
    setShowQrCode(!showQrCode);
  };

  return {
    currentUrl,
    copied,
    showQrCode,
    handleCopy,
    whatsappUrl,
    toggleQrCode,
  };
} 