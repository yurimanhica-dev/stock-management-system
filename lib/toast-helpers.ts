import { toast } from "sonner";

export const toastMessages = {
  // Success messages
  success: {
    saleSaved: "Venda registada com sucesso",
    paymentCompleted: "Pagamento concluído com sucesso",
    itemAdded: "Item adicionado à venda",
    itemRemoved: "Item removido da venda",
    cartCleared: "Carrinho esvaziado",
    stockUpdated: "Stock atualizado com sucesso",
  },

  // Error messages
  error: {
    noItems: "Nenhum item adicionado à venda",
    insufficientStock: "Stock insuficiente para esta quantidade",
    paymentFailed: "Falha ao processar pagamento. Tente novamente",
    invalidPhone: "Número de telefone inválido",
    networkError: "Erro de conexão. Verifique sua internet",
    serverError: "Erro ao contactar o servidor",
    saleError: "Erro ao registar venda. Tente novamente",
  },

  // Warning messages
  warning: {
    lowStock: "Stock baixo para este produto",
    discountLarge: "Desconto muito elevado",
  },

  // Info messages
  info: {
    processing: "A processar sua solicitação",
    checkPhone: "Verifique seu telefone para o prompt M-Pesa",
  },
};

// Toast helper functions
export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, description ? { description } : undefined);
  },
  error: (message: string, description?: string) => {
    toast.error(message, description ? { description } : undefined);
  },
  warning: (message: string, description?: string) => {
    toast.warning(message, description ? { description } : undefined);
  },
  info: (message: string, description?: string) => {
    toast.info(message, description ? { description } : undefined);
  },
};
