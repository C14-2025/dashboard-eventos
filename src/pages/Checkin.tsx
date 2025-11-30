import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Upload, CheckCircle, XCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '@/api/axios';
import { toast } from 'sonner';

const Checkin = () => {
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLastResult(null);

    try {
      const html5Qr = new Html5Qrcode("qr-reader-upload");
      const result = await html5Qr.scanFile(file, true);

      console.log("QR detectado:", result);

      let ticketId = result.trim();

      if (ticketId.startsWith("http")) {
        ticketId = ticketId.split("/").pop() || ticketId;
      }

      ticketId = ticketId.replace(/[^a-zA-Z0-9\-]/g, "");

      console.log("Ticket ID final:", ticketId);

      await html5Qr.clear();

      try {
        await api.put(`/tickets/${ticketId}`, { check: true });

        setLastResult({
          success: true,
          message: 'Check-in realizado com sucesso!',
        });
        toast.success("Check-in realizado com sucesso!");
      } catch (error: any) {
        const msg = error.response?.data?.message || "Erro ao realizar check-in";

        setLastResult({
          success: false,
          message: msg,
        });
        toast.error(msg);
      }

    } catch (err) {
      console.error("Erro ao ler QR:", err);

      setLastResult({
        success: false,
        message: "Não foi possível detectar o QR Code na imagem",
      });

      toast.error("QR Code não encontrado na imagem");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Check-in</h1>
          <p className="text-muted-foreground mt-1">
            Envie uma imagem contendo o QR Code do ticket
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Upload de QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Upload className="w-16 h-16 text-muted-foreground" />

                <p className="text-muted-foreground text-center">
                  Envie uma imagem contendo o QR Code do ticket
                </p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="border rounded p-2 cursor-pointer"
                />

                <div id="qr-reader-upload" className="hidden" />
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
            </CardHeader>

            <CardContent>
              {lastResult ? (
                <div
                  className={`flex items-start gap-3 p-4 rounded-lg ${lastResult.success
                      ? 'bg-success/10 text-success-foreground'
                      : 'bg-destructive/10 text-destructive-foreground'
                    }`}
                >
                  {lastResult.success ? (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  )}

                  <div>
                    <p className="font-medium">
                      {lastResult.success ? 'Sucesso!' : 'Erro'}
                    </p>
                    <p className="text-sm mt-1">{lastResult.message}</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <QrCode className="w-16 h-16 mb-4" />
                  <p className="text-center">Aguardando imagem com QR Code...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Instruções</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Clique no campo de upload</li>
              <li>Selecione a imagem contendo o QR Code</li>
              <li>O sistema fará a leitura automaticamente</li>
              <li>O check-in será realizado em seguida</li>
              <li>Aparecerá uma mensagem de sucesso ou erro</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Checkin;
