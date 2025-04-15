
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, Check, ArrowRight, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  planName: string;
  planDuration: string;
  amount: number;
  onPaymentComplete: () => void;
}

const PaymentModal = ({
  open,
  onClose,
  planName,
  planDuration,
  amount,
  onPaymentComplete
}: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (paymentMethod === "credit_card") {
      // Validate credit card details
      if (cardDetails.number.length < 16 || !cardDetails.name || cardDetails.expiry.length < 5 || cardDetails.cvc.length < 3) {
        toast({
          title: "Informações incompletas",
          description: "Por favor, preencha todos os dados do cartão.",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Process payment
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Pagamento aprovado!",
        description: "Seu anúncio está sendo processado e em breve estará disponível."
      });
      onPaymentComplete();
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950 border-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Finalizar Pagamento</DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete seu pagamento para ativar seu anúncio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-gray-900 p-4 rounded-md">
            <h3 className="font-medium text-white mb-2">Resumo da Compra</h3>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Plano:</span>
              <span className="text-white">{planName}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-300">Duração:</span>
              <span className="text-white">{planDuration}</span>
            </div>
            <Separator className="my-2 bg-gray-800" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-300">Total:</span>
              <span className="text-brand-red">R$ {amount}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-white mb-3">Forma de Pagamento</h3>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit_card" id="credit_card" className="text-brand-red" />
                <Label htmlFor="credit_card" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="h-4 w-4 text-brand-red" />
                  <span>Cartão de Crédito</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pix" id="pix" className="text-brand-red" />
                <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
                  <svg className="h-4 w-4 text-brand-red" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 5L20 12L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 5L11 12L4 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Pix</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {paymentMethod === "credit_card" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card_number">Número do Cartão</Label>
                <Input
                  id="card_number"
                  name="number"
                  placeholder="0000 0000 0000 0000"
                  className="bg-gray-900 border-gray-700"
                  value={cardDetails.number}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="card_name">Nome no Cartão</Label>
                <Input
                  id="card_name"
                  name="name"
                  placeholder="Nome como aparece no cartão"
                  className="bg-gray-900 border-gray-700"
                  value={cardDetails.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Validade (MM/AA)</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    placeholder="MM/AA"
                    className="bg-gray-900 border-gray-700"
                    value={cardDetails.expiry}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    name="cvc"
                    placeholder="123"
                    className="bg-gray-900 border-gray-700"
                    value={cardDetails.cvc}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "pix" && (
            <div className="space-y-4 text-center">
              <div className="bg-white p-6 rounded-md mx-auto w-48 h-48 flex items-center justify-center">
                <div className="text-black text-sm">QR Code PIX</div>
              </div>
              <div className="text-sm text-gray-300">
                Escaneie o QR Code com o aplicativo do seu banco ou copie o código PIX abaixo
              </div>
              <div className="flex">
                <Input
                  value="00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000"
                  className="bg-gray-900 border-gray-700"
                  readOnly
                />
                <Button variant="outline" size="icon" className="ml-2 border-gray-700">
                  <Check className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">O PIX expira em 30 minutos</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button 
              onClick={handleSubmit} 
              className="w-full bg-brand-red hover:bg-red-900 text-white" 
              disabled={isProcessing}
            >
              {isProcessing ? "Processando..." : (
                <>
                  Pagar R$ {amount} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
