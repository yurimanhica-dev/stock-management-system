import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  saleId: string;
  amount: number;
  onPaymentSuccess?: () => void;
}

export function MpesaPaymentModal({
  isOpen,
  onClose,
  saleId,
  amount,
  onPaymentSuccess,
}: MpesaPaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
  };

  const handleInitiatePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error("Número de telefone inválido");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payments/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saleId,
          phoneNumber: phoneNumber.startsWith("258")
            ? phoneNumber
            : `258${phoneNumber.slice(-9)}`,
          amount: Number(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao iniciar pagamento");
        return;
      }

      setPaymentId(data.paymentId);
      setPaymentProcessing(true);
      toast.success(data.message);

      // Poll for payment status
      pollPaymentStatus(data.paymentId);
    } catch (error) {
      console.error("[v0] Payment error:", error);
      toast.error("Erro ao processar pagamento");
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/mpesa?paymentId=${id}`);
        const data = await response.json();

        if (data.status === "completed") {
          clearInterval(interval);
          setPaymentProcessing(false);
          toast.success("Pagamento realizado com sucesso!");
          onPaymentSuccess?.();
          handleClose();
        } else if (data.status === "failed") {
          clearInterval(interval);
          setPaymentProcessing(false);
          toast.error(
            data.errorMessage || "Pagamento falhou. Tente novamente."
          );
        }
      } catch (error) {
        console.error("[v0] Status check error:", error);
      }
    }, 3000); // Check every 3 seconds

    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
  };

  const handleClose = () => {
    setPhoneNumber("");
    setPaymentProcessing(false);
    setPaymentId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento M-Pesa</DialogTitle>
          <DialogDescription>
            Introduza o seu número de telefone para completar o pagamento
          </DialogDescription>
        </DialogHeader>

        {!paymentProcessing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                Número de Telefone M-Pesa
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="258823456789 ou 823456789"
                value={phoneNumber}
                onChange={handlePhoneChange}
                disabled={loading}
                className="mt-2 h-10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Formato: 258... ou apenas 82...
              </p>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground">Valor a pagar</p>
              <p className="text-2xl font-bold mt-1">
                {Number(amount).toFixed(2)} MZN
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleInitiatePayment}
                disabled={loading || !phoneNumber}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    A processar...
                  </>
                ) : (
                  "Pagar agora"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-medium text-sm">Aguardando pagamento...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Verifique o seu telemóvel para o prompt do M-Pesa
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-xs"
            >
              Fechar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
