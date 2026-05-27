"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  expenseCategories,
  getTodayDateString,
  type ExpenseInput,
} from "@/services/expense-types";

interface ManualExpenseFormProps {
  onSubmitExpense: (expense: ExpenseInput) => Promise<void>;
  isSubmitting?: boolean;
}

interface FormState {
  title: string;
  amount: string;
  category: string;
  date: string;
}

interface FormFeedback {
  message: string;
  tone: "error" | "neutral" | "success";
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function createInitialFormState(): FormState {
  return {
    amount: "",
    category: expenseCategories[0],
    date: getTodayDateString(),
    title: "",
  };
}

function validateForm(state: FormState): FormErrors {
  const nextErrors: FormErrors = {};
  const parsedAmount = Number(state.amount);

  if (!state.title.trim()) {
    nextErrors.title = "Informe o título da despesa.";
  }

  if (!state.amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    nextErrors.amount = "Digite um valor maior que zero.";
  }

  if (!state.category.trim()) {
    nextErrors.category = "Selecione uma categoria.";
  }

  if (!state.date) {
    nextErrors.date = "Informe a data da compra.";
  }

  return nextErrors;
}

export function ManualExpenseForm({
  isSubmitting = false,
  onSubmitExpense,
}: ManualExpenseFormProps) {
  const [formState, setFormState] = useState<FormState>(createInitialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [feedback, setFeedback] = useState<FormFeedback | null>({
    message:
      "TODO implement: esta feature deve ser concluída pelos alunos com validação, testes e persistência.",
    tone: "neutral",
  });

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validationErrors = validateForm(formState);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setFeedback({
        message: "Revise os campos destacados antes de salvar.",
        tone: "error",
      });
      return;
    }

    try {
      await onSubmitExpense({
        amount: Number(formState.amount),
        category: formState.category,
        date: formState.date,
        title: formState.title.trim(),
      });

      setFeedback({
        message: "Despesa cadastrada com sucesso.",
        tone: "success",
      });
      setErrors({});
      setFormState(createInitialFormState());
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel salvar a despesa no momento.",
        tone: "error",
      });
    }
  }

  return (
    <section className="data-panel animate-enter">
      {/* Panel header */}
      <div className="data-panel-header flex items-center gap-3">
        <div className="h-5 w-[3px] rounded-full bg-[var(--accent-amber)]" />
        <div>
          <p className="section-eyebrow" style={{ color: "var(--accent-amber)" }}>
            Feature 02
          </p>
          <h2 className="mt-0.5 text-[1rem] font-semibold text-[var(--foreground)]">
            Saída manual
          </h2>
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <p className="mb-4 text-[11.5px] leading-[1.65] text-[var(--muted)]">
          O formulário já está montado, mas o salvamento definitivo das saídas
          ficou como desafio da turma dentro do{" "}
          <code className="rounded bg-[rgba(31,42,34,0.07)] px-1 text-[10.5px] text-[var(--foreground)]">
            expense-service.ts
          </code>
          .
        </p>

        <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="field-label" htmlFor="title">
              Título da despesa
            </label>
            <input
              aria-invalid={Boolean(errors.title)}
              className="field-input"
              id="title"
              name="title"
              onChange={handleInputChange}
              placeholder="Ex.: Mercado semanal"
              type="text"
              value={formState.title}
            />
            {errors.title ? (
              <p className="mt-1 text-[11px] text-[var(--accent-clay)]">
                {errors.title}
              </p>
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="amount">
                Valor (R$)
              </label>
              <input
                aria-invalid={Boolean(errors.amount)}
                className="field-input"
                id="amount"
                min="0"
                name="amount"
                onChange={handleInputChange}
                placeholder="0,00"
                step="0.01"
                type="number"
                value={formState.amount}
              />
              {errors.amount ? (
                <p className="mt-1 text-[11px] text-[var(--accent-clay)]">
                  {errors.amount}
                </p>
              ) : null}
            </div>

            <div>
              <label className="field-label" htmlFor="date">
                Data da compra
              </label>
              <input
                aria-invalid={Boolean(errors.date)}
                className="field-input"
                id="date"
                name="date"
                onChange={handleInputChange}
                type="date"
                value={formState.date}
              />
              {errors.date ? (
                <p className="mt-1 text-[11px] text-[var(--accent-clay)]">
                  {errors.date}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="category">
              Categoria
            </label>
            <select
              aria-invalid={Boolean(errors.category)}
              className="field-input"
              id="category"
              name="category"
              onChange={handleInputChange}
              value={formState.category}
            >
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category ? (
              <p className="mt-1 text-[11px] text-[var(--accent-clay)]">
                {errors.category}
              </p>
            ) : null}
          </div>

          {feedback ? (
            <p
              className={`rounded-xl border px-3.5 py-2.5 text-[11.5px] leading-[1.6] ${
                feedback.tone === "success"
                  ? "border-[rgba(31,138,112,0.18)] bg-[rgba(240,252,248,0.9)] text-[var(--accent-forest)]"
                  : feedback.tone === "error"
                    ? "border-[rgba(201,92,84,0.18)] bg-[rgba(255,244,243,0.9)] text-[var(--accent-clay)]"
                    : "border-[rgba(217,123,44,0.15)] bg-[rgba(255,247,238,0.85)] text-[var(--foreground)]"
              }`}
              role={feedback.tone === "error" ? "alert" : "status"}
            >
              {feedback.message}
            </p>
          ) : null}

          <button
            className="w-full rounded-xl bg-[var(--accent-amber)] px-4 py-2.5 text-[11.5px] font-semibold tracking-[0.1em] text-white uppercase transition hover:bg-[rgba(217,123,44,0.88)] hover:shadow-[0_4px_16px_rgba(217,123,44,0.3)] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Salvando…" : "Salvar despesa"}
          </button>
        </form>

        {/* TODO implement: adicionar mais testes para regras de negócio da saída manual. */}
      </div>
    </section>
  );
}
