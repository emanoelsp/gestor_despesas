import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReceiptUploadPanel } from "@/components/receipt-upload-panel";

describe("ReceiptUploadPanel", () => {
  test("renderiza a feature de leitura por arquivo como scaffold", () => {
    const onSubmitExpense = jest.fn().mockResolvedValue(undefined);

    render(<ReceiptUploadPanel onSubmitExpense={onSubmitExpense} />);

    expect(
      screen.getByRole("heading", { name: "Saída por leitura de PDF ou imagem" }),
    ).toBeInTheDocument();
  });

  test("mostra o nome do arquivo selecionado para a análise", async () => {
    const user = userEvent.setup();
    const onSubmitExpense = jest.fn().mockResolvedValue(undefined);

    render(<ReceiptUploadPanel onSubmitExpense={onSubmitExpense} />);

    const input = screen.getByLabelText(/arquivo da nota fiscal/i);
    const file = new File(["dummy"], "nota-mercado.pdf", {
      type: "application/pdf",
    });

    await user.upload(input, file);

    expect(
      screen.getByText(/Arquivo pronto para análise:/i),
    ).toBeInTheDocument();
    expect(screen.getByText("nota-mercado.pdf")).toBeInTheDocument();
  });

  test.skip(
    "TODO implement: envia a nota, extrai os dados e salva a despesa",
    async () => {
      const user = userEvent.setup();
      const onSubmitExpense = jest.fn().mockResolvedValue(undefined);

      render(<ReceiptUploadPanel onSubmitExpense={onSubmitExpense} />);

      const input = screen.getByLabelText(/arquivo da nota fiscal/i);
      const file = new File(["dummy"], "nota-mercado.pdf", {
        type: "application/pdf",
      });

      await user.upload(input, file);
      await user.click(
        screen.getByRole("button", { name: /analisar nota fiscal/i }),
      );

      expect(onSubmitExpense).toHaveBeenCalled();
    },
  );
});
