import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Copy, QrCodeIcon, Share2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import {QRCode} from "react-qrcode-logo";

export default function ShareUrl() {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(currentUrl)}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="fixed bottom-4 right-4 p-3 rounded-full shadow-lg  text-white hover:"
        >
          <Share2 className="w-6 h-6   dark:text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center p-4 w-80 max-w-full">
        <p className="text-lg font-semibold mb-4">Compartir enlace</p>
        <Button variant="outline" onClick={handleCopy} className="w-full mb-2">
          <Copy className="w-5 h-5 mr-2" />
          {copied ? "Copiado!" : "Copiar"}
        </Button>
        <Button asChild variant="outline" className="w-full mb-2">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="w-5 h-5 mr-2 tex" />
            WhatsApp
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={() => setShowQrCode(!showQrCode)}
          className="w-full mb-2"
        >
          <QrCodeIcon/>
          QR
        </Button>
        <QRCode value={currentUrl} logoImage="/logo_umss.png"  logoWidth={50} logoPadding={2} size={200}/>
        {showQrCode && (
          <Card className="w-full mt-4">
            <CardTitle className="text-center">Escanea el código QR</CardTitle>
            <CardContent className="flex justify-center">
              <QRCodeCanvas  value={currentUrl} size={200} />
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
