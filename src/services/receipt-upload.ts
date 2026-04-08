import {
  expenseCategories,
  getTodayDateString,
  type ExpenseInput,
} from "@/services/expense-types";

export interface ReceiptExtractionApiResult {
  establishmentName: string | null;
  amount: number | null;
  purchaseDate?: string | null;
  suggestedCategory?: string | null;
  rawText?: string;
}

export const supportedReceiptMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export function getSupportedReceiptTypesLabel() {
  return "PDF, JPG, PNG ou WEBP";
}

export function isSupportedReceiptFile(file: Pick<File, "type">) {
  return supportedReceiptMimeTypes.includes(
    file.type as (typeof supportedReceiptMimeTypes)[number],
  );
}

export function getReceiptFileValidationMessage(
  file: Pick<File, "type"> | null,
) {
  if (!file) {
    return "Selecione uma nota fiscal em PDF ou imagem para continuar.";
  }

  if (!isSupportedReceiptFile(file)) {
    return `Envie um arquivo em ${getSupportedReceiptTypesLabel()}.`;
  }

  return null;
}

export function mapReceiptExtractionToExpense(
  extraction: ReceiptExtractionApiResult,
): ExpenseInput {
  const suggestedCategory =
    extraction.suggestedCategory &&
    expenseCategories.includes(extraction.suggestedCategory)
      ? extraction.suggestedCategory
      : "Outros";

  return {
    amount: Number(extraction.amount ?? 0),
    category: suggestedCategory,
    date: extraction.purchaseDate ?? getTodayDateString(),
    title: extraction.establishmentName?.trim() || "Despesa importada",
  };
}

export async function extractExpenseFromReceipt(
  file: File,
): Promise<ExpenseInput> {
  const validationMessage = getReceiptFileValidationMessage(file);

  if (validationMessage) {
    throw new Error(validationMessage);
  }

  const formData = new FormData();
  formData.set("receipt", file);

  const response = await fetch("/api/receipt-extraction", {
    body: formData,
    method: "POST",
  });

  const payload = (await response.json()) as Partial<ReceiptExtractionApiResult> & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      payload.error ?? "Nao foi possivel processar a nota fiscal enviada.",
    );
  }

  // TODO implement: validar o contrato retornado pela rota de OCR.
  // TODO implement: confirmar se establishmentName e amount vieram preenchidos.
  // TODO implement: permitir ajustes manuais antes de persistir a despesa.
  throw new Error(
    "TODO implement: conclua o mapeamento da nota fiscal para uma despesa valida.",
  );
}
