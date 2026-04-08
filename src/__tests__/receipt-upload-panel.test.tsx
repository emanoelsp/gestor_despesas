import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReceiptUploadPanel } from "@/components/receipt-upload-panel";

describe("ReceiptUploadPanel", () => {
  test("mostra erro quando a nota fiscal nao foi selecionada", async () => {
    const user = userEvent.setup();
    const onSubmitExpense = jest.fn().mockResolvedValue(undefined);

    render(<ReceiptUploadPanel onSubmitExpense={onSubmitExpense} />);

    await user.click(
      screen.getByRole("button", { name: /analisar nota fiscal/i }),
    );

    expect(
      screen.getByText(/Selecione uma nota fiscal em PDF ou imagem/i),
    ).toBeInTheDocument();
    expect(onSubmitExpense).not.toHaveBeenCalled();
  });

  test("mostra o nome do arquivo selecionado para a analise", async () => {
    const user = userEvent.setup();
    const onSubmitExpense = jest.fn().mockResolvedValue(undefined);

    render(<ReceiptUploadPanel onSubmitExpense={onSubmitExpense} />);

    const input = screen.getByLabelText(/arquivo da nota fiscal/i);
    const file = new File(["dummy"], "nota-mercado.pdf", {
      type: "application/pdf",
    });

    await user.upload(input, file);

    expect(
      screen.getByText(/Arquivo pronto para analise:/i),
    ).toBeInTheDocument();
    expect(screen.getByText("nota-mercado.pdf")).toBeInTheDocument();
  });
});
