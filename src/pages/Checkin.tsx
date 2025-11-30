import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Camera, CheckCircle, XCircle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '@/api/axios';
import { toast } from 'sonner';

const Checkin = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [scanner]);

  const startScanner = () => {
    setLastResult(null);
    setIsScanning(true); // apenas altera o estado
  };

  // quando isScanning mudar para true, o DOM já terá renderizado o #qr-reader
  useEffect(() => {
    if (!isScanning) return;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanError);
    setScanner(html5QrcodeScanner);

    return () => {
      html5QrcodeScanner.clear();
    };
  }, [isScanning]);


  const stopScanner = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setIsScanning(false);
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log('QR Code detected:', decodedText);

    if (scanner) {
      scanner.clear();
      setScanner(null);
    }
    setIsScanning(false);

    try {
      const ticketId = decodedText;
      await api.put(`/tickets/${ticketId}`, { check: true });

      setLastResult({
        success: true,
        message: 'Check-in realizado com sucesso!',
      });
      toast.success('Check-in realizado com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao realizar check-in';
      setLastResult({
        success: false,
        message: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  const onScanError = (error: any) => {
    // Ignore errors, they are usually just "no QR code found"
    console.warn('QR Scan error:', error);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Check-in</h1>
          <p className="text-muted-foreground mt-1">
            Escaneie o QR Code do ticket para realizar o check-in
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Leitor de QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Camera className="w-16 h-16 text-muted-foreground" />
                  <p className="text-muted-foreground text-center">
                    Clique no botão abaixo para abrir a câmera e escanear o QR Code
                  </p>
                  <Button onClick={startScanner} size="lg">
                    <Camera className="w-4 h-4 mr-2" />
                    Abrir Câmera
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div id="qr-reader" className="w-full" />
                  <Button onClick={stopScanner} variant="secondary" className="w-full">
                    Parar Scanner
                  </Button>
                </div>
              )}
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
                  <p className="text-center">
                    Aguardando leitura de QR Code...
                  </p>
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
              <li>Clique no botão "Abrir Câmera" para ativar o scanner</li>
              <li>Aponte a câmera para o QR Code do ticket</li>
              <li>Aguarde a leitura automática do código</li>
              <li>O sistema realizará o check-in automaticamente</li>
              <li>Uma mensagem de sucesso ou erro será exibida</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Checkin;
