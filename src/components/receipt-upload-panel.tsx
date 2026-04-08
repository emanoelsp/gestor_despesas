"use client";

import { useId, useState, type ChangeEvent } from "react";
import type { ExpenseInput } from "@/services/expense-types";
import {
  extractExpenseFromReceipt,
  getReceiptFileValidationMessage,
  getSupportedReceiptTypesLabel,
} from "@/services/receipt-upload";

interface ReceiptUploadPanelProps {
  onSubmitExpense: (expense: ExpenseInput) => Promise<void>;
  isSubmitting?: boolean;
}

interface PanelFeedback {
  message: string;
  tone: "error" | "neutral" | "success";
}

export function ReceiptUploadPanel({
  isSubmitting = false,
  onSubmitExpense,
}: ReceiptUploadPanelProps) {
  const inputId = useId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<PanelFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setSelectedFile(nextFile);

    const validationMessage = getReceiptFileValidationMessage(nextFile);

    if (validationMessage) {
      setFeedback({
        message: validationMessage,
        tone: "error",
      });
      return;
    }

    if (nextFile) {
      setFeedback({
        message: `Arquivo selecionado: ${nextFile.name}`,
        tone: "neutral",
      });
      return;
    }

    setFeedback(null);
  }

  async function handleAnalyzeReceipt() {
    const validationMessage = getReceiptFileValidationMessage(selectedFile);

    if (validationMessage) {
      setFeedback({
        message: validationMessage,
        tone: "error",
      });
      return;
    }

    if (!selectedFile) {
      return;
    }

    setIsAnalyzing(true);
    setFeedback({
      message: "Arquivo enviado para a trilha de extracao da nota fiscal.",
      tone: "neutral",
    });

    try {
      const extractedExpense = await extractExpenseFromReceipt(selectedFile);
      await onSubmitExpense(extractedExpense);

      setFeedback({
        message: "Despesa criada automaticamente a partir da nota fiscal.",
        tone: "success",
      });
      setSelectedFile(null);
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error
            ? error.message
            : "Nao foi possivel concluir a importacao da nota fiscal.",
        tone: "error",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <section className="glass-panel animate-enter rounded-[36px] border border-[color:var(--border)] px-5 py-6 sm:px-7 sm:py-7">
      <div className="flex flex-col gap-3">
        <div>
          <p className="section-eyebrow">Upload de nota fiscal</p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
            Saida por foto ou PDF antes da camera
          </h2>
        </div>
        <p className="text-sm leading-7 text-[color:var(--muted)]">
          Este fluxo intermedio prepara a turma para a etapa de OCR. A base ja
          aceita o arquivo e envia a nota para a rota de extracao, mas o
          mapeamento final ainda esta marcado com `TODO implement`.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <div className="rounded-[28px] border border-[rgba(31,138,112,0.16)] bg-[rgba(240,252,248,0.8)] p-4 text-sm leading-7 text-[color:var(--foreground)]">
          <p className="font-medium">Fluxo esperado da atividade</p>
          <p>1. Selecionar uma nota fiscal em imagem ou PDF.</p>
          <p>2. Enviar o arquivo para `/api/receipt-extraction`.</p>
          <p>3. Extrair nome do local e valor da compra.</p>
          <p>4. Salvar o resultado como saida (despesa) no Firestore.</p>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-[color:var(--foreground)]"
            htmlFor={inputId}
          >
            Arquivo da nota fiscal
          </label>
          <input
            accept="application/pdf,image/jpeg,image/png,image/webp"
            className="w-full rounded-[22px] border border-[rgba(31,42,34,0.14)] bg-white/88 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--accent-forest)] focus:ring-4 focus:ring-[rgba(31,138,112,0.12)]"
            id={inputId}
            onChange={handleFileChange}
            type="file"
          />
          <p className="text-xs leading-6 text-[color:var(--muted)]">
            Tipos aceitos na base: {getSupportedReceiptTypesLabel()}.
          </p>
          {selectedFile ? (
            <p className="text-sm leading-6 text-[color:var(--foreground)]">
              Arquivo pronto para analise: <strong>{selectedFile.name}</strong>
            </p>
          ) : null}
        </div>

        {feedback ? (
          <p
            className={`rounded-[22px] border px-4 py-3 text-sm leading-6 ${
              feedback.tone === "success"
                ? "border-[rgba(31,138,112,0.18)] bg-[rgba(240,252,248,0.95)] text-[color:var(--accent-forest)]"
                : feedback.tone === "error"
                  ? "border-[rgba(201,92,84,0.18)] bg-[rgba(255,244,243,0.95)] text-[color:var(--accent-clay)]"
                  : "border-[rgba(31,42,34,0.12)] bg-white/90 text-[color:var(--foreground)]"
            }`}
            role={feedback.tone === "error" ? "alert" : "status"}
          >
            {feedback.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-full bg-[color:var(--foreground)] px-5 py-3 text-sm font-semibold tracking-[0.08em] text-white uppercase transition hover:-translate-y-0.5 hover:bg-[rgba(31,42,34,0.92)] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isAnalyzing || isSubmitting}
            onClick={() => void handleAnalyzeReceipt()}
            type="button"
          >
            {isAnalyzing ? "Analisando..." : "Analisar nota fiscal"}
          </button>
          <button
            className="rounded-full border border-[rgba(31,42,34,0.12)] bg-white px-5 py-3 text-sm font-semibold tracking-[0.08em] text-[color:var(--foreground)] uppercase transition hover:-translate-y-0.5"
            onClick={() => {
              setSelectedFile(null);
              setFeedback(null);
            }}
            type="button"
          >
            Limpar arquivo
          </button>
        </div>
      </div>

      {/* TODO implement: exibir os dados extraidos em campos editaveis antes do salvamento final. */}
      {/* TODO implement: adicionar preview da nota fiscal para apoiar a revisao manual. */}
    </section>
  );
}
