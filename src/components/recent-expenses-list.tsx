import type { Expense } from "@/services/expense-types";
import { formatCurrency, formatExpenseDate } from "@/services/formatters";

interface RecentExpensesListProps {
  expenses: Expense[];
  loading: boolean;
  deletingExpenseId: string | null;
  onDeleteExpense: (id: string) => Promise<void>;
}

export function RecentExpensesList({
  deletingExpenseId,
  expenses,
  loading,
  onDeleteExpense,
}: RecentExpensesListProps) {
  return (
    <section className="glass-panel animate-enter rounded-[36px] border border-[color:var(--border)] px-5 py-6 sm:px-7 sm:py-7">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Ultimas despesas</p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
            Resumo das notas recentes
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-7 text-[color:var(--muted)]">
          Os registros sao ordenados por data de criacao e ficam prontos para
          exclusao individual.
        </p>
      </div>

      {loading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`expense-skeleton-${index}`}
              className="h-20 animate-pulse rounded-[24px] border border-white/70 bg-white/65"
            />
          ))}
        </div>
      ) : null}

      {!loading && expenses.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-dashed border-[rgba(31,42,34,0.14)] bg-white/70 p-6 text-sm leading-7 text-[color:var(--muted)]">
          Nenhuma despesa cadastrada ainda. Use o formulario manual ou o fluxo
          de upload de nota fiscal para criar o primeiro lancamento e
          acompanhar a sincronizacao em tempo real.
        </div>
      ) : null}

      {!loading && expenses.length > 0 ? (
        <div className="mt-8 space-y-3">
          {expenses.map((expense) => (
            <article
              key={expense.id}
              className="grid gap-4 rounded-[28px] border border-white/70 bg-white/82 p-4 shadow-[0_14px_34px_rgba(31,42,34,0.05)] md:grid-cols-[1fr_auto]"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                    {expense.title}
                  </h3>
                  <span className="rounded-full bg-[rgba(31,138,112,0.1)] px-3 py-1 text-xs font-medium tracking-[0.08em] text-[color:var(--accent-forest)] uppercase">
                    {expense.category}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
                  <span>{formatExpenseDate(expense.date)}</span>
                  <span className="h-1 w-1 rounded-full bg-[rgba(31,42,34,0.28)]" />
                  <span>{formatCurrency(expense.amount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                <p className="text-2xl font-semibold text-[color:var(--foreground)]">
                  {formatCurrency(expense.amount)}
                </p>
                <button
                  className="rounded-full border border-[rgba(201,92,84,0.18)] bg-[rgba(255,244,243,0.94)] px-4 py-2 text-sm font-medium text-[color:var(--accent-clay)] transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(201,92,84,0.16)] disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={deletingExpenseId === expense.id}
                  onClick={() => void onDeleteExpense(expense.id)}
                  type="button"
                >
                  {deletingExpenseId === expense.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
