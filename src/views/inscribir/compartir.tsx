import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Copy, QrCodeIcon, Share2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { QRCode } from "react-qrcode-logo";
import { useShareUrlViewModel } from "@/viewModels/usarVistaModelo/inscribir/useShareUrlViewModel";

export default function ShareUrl() {
  const {
    currentUrl,
    copied,
    showQrCode,
    handleCopy,
    whatsappUrl,
    toggleQrCode,
  } = useShareUrlViewModel();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="fixed bottom-1/12 right-5 p-3 rounded-full shadow-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-300 cursor-pointer">
          <Share2 className="w-6 h-6 dark:text-white" />
        </div>
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
          onClick={toggleQrCode}
          className="w-full mb-2"
        >
          <QrCodeIcon />
          QR
        </Button>
        <QRCode
          value={currentUrl}
          logoImage="/logo_umss.png"
          logoWidth={50}
          logoPadding={2}
          size={200}
        />
        {showQrCode && (
          <Card className="w-full mt-4">
            <CardTitle className="text-center">Escanea el código QR</CardTitle>
            <CardContent className="flex justify-center">
              <QRCodeCanvas value={currentUrl} size={200} />
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
