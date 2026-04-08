import { formatCurrency } from "@/services/formatters";

interface OverviewChartProps {
  income: number;
  expenses: number;
  loading: boolean;
}

export function OverviewChart({
  expenses,
  income,
  loading,
}: OverviewChartProps) {
  const higherValue = Math.max(expenses, income, 1);
  const balance = income - expenses;
  const chartItems = [
    {
      accent:
        "from-[rgba(31,138,112,0.95)] to-[rgba(84,188,159,0.92)] shadow-[0_14px_28px_rgba(31,138,112,0.22)]",
      helper: "Entrada usada como referencia no painel inicial.",
      label: "Entradas previstas",
      value: income,
    },
    {
      accent:
        "from-[rgba(217,123,44,0.95)] to-[rgba(238,180,95,0.92)] shadow-[0_14px_28px_rgba(217,123,44,0.2)]",
      helper: "Despesa total proveniente dos documentos salvos no Firestore.",
      label: "Gastos acumulados",
      value: expenses,
    },
  ];

  return (
    <section className="glass-panel animate-enter rounded-[36px] border border-[color:var(--border)] px-5 py-6 sm:px-7 sm:py-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Dashboard</p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
            Total de gastos vs entradas
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            Um comparativo simples para apoiar as aulas sobre leitura de dados,
            integracao com o Firestore e evolucao do OCR por upload e camera.
          </p>
        </div>

        <div className="rounded-[24px] border border-white/80 bg-white/78 px-4 py-3 text-left sm:text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
            Saldo projetado
          </p>
          <p className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {chartItems.map((item) => {
          const widthPercentage = Math.max(
            Math.round((item.value / higherValue) * 100),
            item.value === 0 ? 6 : 16,
          );

          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
                <span>{item.label}</span>
                <span className="font-medium text-[color:var(--foreground)]">
                  {loading ? "Sincronizando..." : formatCurrency(item.value)}
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full border border-white/60 bg-[rgba(31,42,34,0.06)]">
                <div
                  className={`animate-bar-rise h-full rounded-full bg-gradient-to-r ${item.accent}`}
                  style={{ width: `${widthPercentage}%` }}
                />
              </div>
              <p className="text-xs leading-6 text-[color:var(--muted)]">
                {item.helper}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
