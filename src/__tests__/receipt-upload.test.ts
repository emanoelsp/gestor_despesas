import {
  extractExpenseFromReceipt,
  getReceiptFileValidationMessage,
  isSupportedReceiptFile,
} from "@/services/receipt-upload";

describe("receipt-upload service", () => {
  test("aceita PDF e imagens no fluxo de upload", () => {
    expect(isSupportedReceiptFile({ type: "application/pdf" })).toBe(true);
    expect(isSupportedReceiptFile({ type: "image/png" })).toBe(true);
    expect(isSupportedReceiptFile({ type: "image/jpeg" })).toBe(true);
  });

  test("retorna mensagem quando o tipo do arquivo nao e suportado", () => {
    expect(
      getReceiptFileValidationMessage({ type: "text/plain" }),
    ).toMatch(/Envie um arquivo em PDF, JPG, PNG ou WEBP/i);
  });

  test.skip(
    "TODO implement: converte o retorno da API de OCR em despesa pronta para persistencia",
    async () => {
      const originalFetch = global.fetch;
      const fetchMock = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          amount: 28.9,
          establishmentName: "Padaria da Praca",
          purchaseDate: "2026-04-07",
          suggestedCategory: "Alimentacao",
        }),
      });

      global.fetch = fetchMock as unknown as typeof fetch;

      const file = new File(["dummy"], "nota.pdf", {
        type: "application/pdf",
      });

      await expect(extractExpenseFromReceipt(file)).resolves.toEqual({
        amount: 28.9,
        category: "Alimentacao",
        date: "2026-04-07",
        title: "Padaria da Praca",
      });

      global.fetch = originalFetch;
    },
  );
});
