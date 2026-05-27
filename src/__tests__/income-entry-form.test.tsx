import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IncomeEntryForm } from "@/components/income-entry-form";

describe("IncomeEntryForm", () => {
  test("renderiza o formulario de entradas como scaffold da atividade", () => {
    const onSubmitIncomeEntry = jest.fn().mockResolvedValue(undefined);

    render(<IncomeEntryForm onSubmitIncomeEntry={onSubmitIncomeEntry} />);

    expect(
      screen.getByRole("heading", { name: /cadastro de entradas/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/TODO implement: esta feature deve ser concluída/i),
    ).toBeInTheDocument();
  });

  test(
    "TODO implement: valida e envia a entrada quando a feature estiver concluida",
    async () => {
      const user = userEvent.setup();
      const onSubmitIncomeEntry = jest.fn().mockResolvedValue(undefined);

      render(<IncomeEntryForm onSubmitIncomeEntry={onSubmitIncomeEntry} />);

      await user.type(
        screen.getByLabelText(/descrição da entrada/i),
        "Pagamento do cliente",
      );
      await user.type(screen.getByLabelText(/valor/i), "500");
      await user.click(screen.getByRole("button", { name: /salvar entrada/i }));

      expect(onSubmitIncomeEntry).toHaveBeenCalledWith({
        amount: 500,
        date: expect.any(String),
        source: "Salario",
        title: "Pagamento do cliente",
      });
    },
  );
});
