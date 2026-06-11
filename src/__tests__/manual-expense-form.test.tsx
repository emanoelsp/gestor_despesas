import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ManualExpenseForm } from "@/components/manual-expense-form";

describe("ManualExpenseForm", () => {
  test("renderiza o formulario manual como scaffold da atividade", () => {
    const onSubmitExpense = jest.fn<Promise<void>, []>().mockResolvedValue();

    render(<ManualExpenseForm onSubmitExpense={onSubmitExpense} />);

    expect(
      screen.getByRole("heading", { name: "Saída manual" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/TODO implement: esta feature deve ser concluída/i),
    ).toBeInTheDocument();
  });

  test(
    "TODO implement: bloqueia saidas manuais com valores invalidos",
    async () => {
      const user = userEvent.setup();
      const onSubmitExpense = jest.fn().mockResolvedValue(undefined);

      render(<ManualExpenseForm onSubmitExpense={onSubmitExpense} />);

      await user.type(screen.getByLabelText(/título da despesa/i), "Mercado");
      await user.type(screen.getByLabelText(/valor/i), "-12");
      await user.click(screen.getByRole("button", { name: /salvar despesa/i }));

      expect(
        screen.getByText("Digite um valor maior que zero."),
      ).toBeInTheDocument();
      expect(onSubmitExpense).not.toHaveBeenCalled();
    },
  );

  test(
    "TODO implement: envia a saida manual normalizada quando a feature estiver concluida",
    async () => {
      const user = userEvent.setup();
      const onSubmitExpense = jest.fn().mockResolvedValue(undefined);

    render(<ManualExpenseForm onSubmitExpense={onSubmitExpense} />);

    await user.type(
      screen.getByLabelText(/título da despesa/i),
      "Mercado semanal",
    );
    await user.type(screen.getByLabelText(/valor/i), "123.45");
    await user.clear(screen.getByLabelText(/data da compra/i));
    await user.type(screen.getByLabelText(/data da compra/i), "2026-03-30");
    await user.selectOptions(screen.getByLabelText(/categoria/i), "Saude");
    await user.click(screen.getByRole("button", { name: /salvar despesa/i }));

    expect(onSubmitExpense).toHaveBeenCalledWith({
      amount: 123.45,
      category: "Saude",
      date: "2026-03-30",
      title: "Mercado semanal",
    });
    expect(
      await screen.findByText("Despesa cadastrada com sucesso."),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/título da despesa/i)).toHaveValue("");
    expect(screen.getByLabelText(/valor/i)).toHaveValue(null);
    expect(screen.getByLabelText(/categoria/i)).toHaveValue("Alimentacao");
    },
  );
});
