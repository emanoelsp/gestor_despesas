"use client";

import { CameraScanPanel } from "@/components/camera-scan-panel";
import { ManualExpenseForm } from "@/components/manual-expense-form";
import { OverviewChart } from "@/components/overview-chart";
import { RecentExpensesList } from "@/components/recent-expenses-list";
import { ReceiptUploadPanel } from "@/components/receipt-upload-panel";
import { SummaryCard } from "@/components/summary-card";
import { demoMonthlyIncome } from "@/services/expense-types";
import { formatCurrency } from "@/services/formatters";
import { useExpenses } from "@/services/use-expenses";

export function ExpenseDashboardApp() {
  const {
    addExpense,
    deleteExpense,
    deletingExpenseId,
    error,
    expenses,
    isConfigured,
    isSubmitting,
    loading,
  } = useExpenses();

  const totalExpenses = expenses.reduce(
    (currentTotal, expense) => currentTotal + expense.amount,
    0,
  );
  const remainingBalance = demoMonthlyIncome - totalExpenses;
  const latestExpenses = expenses.slice(0, 5);
  const progressPercentage = Math.min(
    Math.round((totalExpenses / demoMonthlyIncome) * 100),
    100,
  );

  return (
    <main className="relative flex-1 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-12 left-8 h-44 w-44 rounded-full bg-[rgba(217,123,44,0.14)] blur-3xl" />
        <div className="absolute right-0 bottom-8 h-56 w-56 rounded-full bg-[rgba(31,138,112,0.16)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="glass-panel animate-enter overflow-hidden rounded-[36px] border border-[color:var(--border)] px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <span className="section-eyebrow">Fluxo Financeiro</span>
              <div className="space-y-3">
                <h1 className="max-w-2xl text-4xl leading-tight font-semibold text-[color:var(--foreground)] sm:text-5xl">
                  Controle as despesas da equipe com uma base pronta para
                  Firebase, GitHub, Jenkins e Vercel.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                  O dashboard reune o resumo financeiro, o cadastro manual, a
                  nova trilha de upload de notas fiscais e o espaco reservado
                  para evolucao futura com camera. A persistencia fica
                  preparada para o Firestore em tempo real.
                </p>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/70 bg-white/72 p-5">
              <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
                <span>Uso do orcamento de exemplo</span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[rgba(31,42,34,0.08)]">
                <div
                  className="animate-bar-rise h-full rounded-full bg-gradient-to-r from-[color:var(--accent-amber)] to-[color:var(--accent-forest)]"
                  style={{
                    width: `${Math.max(progressPercentage, expenses.length ? 12 : 4)}%`,
                  }}
                />
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Saldo estimado
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-[color:var(--foreground)]">
                    {formatCurrency(remainingBalance)}
                  </p>
                </div>
                <p className="max-w-[14rem] text-right text-sm leading-6 text-[color:var(--muted)]">
                  Entradas demonstrativas fixadas em{" "}
                  {formatCurrency(demoMonthlyIncome)} para simplificar o
                  comparativo visual do dashboard.
                </p>
              </div>
            </div>
          </div>

          {!isConfigured ? (
            <div className="mt-6 rounded-[28px] border border-[rgba(217,123,44,0.28)] bg-[rgba(255,255,255,0.86)] p-5 text-sm leading-7 text-[color:var(--foreground)]">
              <p className="font-medium">
                Configure as variaveis `NEXT_PUBLIC_FIREBASE_*` para ativar o
                Firestore.
              </p>
              <p className="mt-2 text-[color:var(--muted)]">
                A estrutura da aplicacao, do hook e das operacoes de CRUD ja
                esta pronta. Falta apenas conectar as credenciais do projeto no
                ambiente local ou na Vercel.
              </p>
            </div>
          ) : null}

          {isConfigured && error ? (
            <div
              role="alert"
              className="mt-6 rounded-[28px] border border-[rgba(201,92,84,0.28)] bg-[rgba(255,255,255,0.84)] p-5 text-sm leading-7 text-[color:var(--accent-clay)]"
            >
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <SummaryCard
              description="Valor usado como base para comparar gastos e entradas."
              tone="forest"
              title="Entradas"
              value={formatCurrency(demoMonthlyIncome)}
            />
            <SummaryCard
              description="Soma de todas as despesas sincronizadas no Firestore."
              tone="amber"
              title="Despesas"
              value={formatCurrency(totalExpenses)}
            />
            <SummaryCard
              description="Quantidade de itens cadastrados e prontos para exclusao."
              tone="clay"
              title="Lancamentos"
              value={`${expenses.length} registro${expenses.length === 1 ? "" : "s"}`}
            />
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="space-y-6">
            <OverviewChart
              expenses={totalExpenses}
              income={demoMonthlyIncome}
              loading={loading}
            />

            <RecentExpensesList
              deletingExpenseId={deletingExpenseId}
              expenses={latestExpenses}
              loading={loading}
              onDeleteExpense={deleteExpense}
            />
          </section>

          <aside className="space-y-6">
            <ManualExpenseForm
              isSubmitting={isSubmitting}
              onSubmitExpense={addExpense}
            />
            <ReceiptUploadPanel
              isSubmitting={isSubmitting}
              onSubmitExpense={addExpense}
            />
            <CameraScanPanel />
          </aside>
        </div>
      </div>
    </main>
  );
}
