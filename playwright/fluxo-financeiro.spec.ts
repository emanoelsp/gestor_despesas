import { test, expect, Page } from "@playwright/test";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function irParaAba(page: Page, nomeAba: string) {
  await page.getByRole("button", { name: nomeAba }).click();
}

async function preencherESalvarEntrada(
  page: Page,
  descricao: string,
  valor: string
) {
  await page.getByLabel("Descrição").fill(descricao);
  await page.getByLabel("Valor (R$)").fill(valor);
  await page.getByRole("button", { name: "Salvar entrada" }).click();
}

async function preencherESalvarDespesa(
  page: Page,
  titulo: string,
  valor: string
) {
  await page.getByLabel("Título da despesa").fill(titulo);
  await page.getByLabel("Valor (R$)").fill(valor);
  await page.getByRole("button", { name: "Salvar despesa" }).click();
}

// ---------------------------------------------------------------------------
// Cenário 1 — Cadastro de entrada financeira
// ---------------------------------------------------------------------------

test("cadastro de entrada financeira salva no Firestore e atualiza o card Entradas", async ({
  page,
}) => {
  await page.goto("/");

  // Captura o valor atual do card Entradas antes de inserir
  const cardEntradas = page.locator('xpath=/html/body/div[2]/main/div/div[1]/article[1]');
  const valorAntes = await cardEntradas.textContent();

  await irParaAba(page, "Entradas");
  await preencherESalvarEntrada(page, "Salário junho", "5000");

  // Mensagem de sucesso deve aparecer
  await expect(page.getByText("Entrada cadastrada com sucesso")).toBeVisible();

  // O card Entradas deve refletir o novo valor (diferente do anterior)
  await expect(cardEntradas).not.toHaveText(valorAntes ?? "");
});

// ---------------------------------------------------------------------------
// Cenário 2 — Cadastro de saída manual
// ---------------------------------------------------------------------------

test("cadastro de saída manual salva no Firestore e aparece na lista de lançamentos", async ({
  page,
}) => {
  await page.goto("/");

  await irParaAba(page, "Saída Manual");
  await preencherESalvarDespesa(page, "Mercado semanal", "150");

  await expect(
    page.getByText("Despesa cadastrada com sucesso")
  ).toBeVisible();
  await expect(page.getByText("Mercado semanal")).toBeVisible();
});

// ---------------------------------------------------------------------------
// Cenário 3 — Exclusão de despesa
// ---------------------------------------------------------------------------

test.describe("exclusão de despesa", () => {
  test.beforeEach(async ({ page }) => {
    // Garante que existe ao menos uma despesa para excluir
    await page.goto("/");
    await irParaAba(page, "Saída Manual");
    await preencherESalvarDespesa(page, "Despesa para exclusão", "50");
    await expect(page.getByText("Despesa para exclusão")).toBeVisible();
  });

  test("exclui uma despesa da lista sem recarregar a página", async ({
    page,
  }) => {
    // Clica no botão ✕ do item recém-criado
    const botaoExcluir = page.locator('xpath=/html/body/div[2]/main/div/div[2]/section/section[2]/div[2]/article[1]/button');
    await botaoExcluir.click();

    await expect(page.getByText("Despesa para exclusão")).not.toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// Cenário 4 — Confirmação e limpeza do formulário
// ---------------------------------------------------------------------------

test("após salvar uma saída manual, exibe mensagem de sucesso e limpa os campos", async ({
  page,
}) => {
  await page.goto("/");

  await irParaAba(page, "Saída Manual");

  const campoTitulo = page.getByLabel("Título da despesa");
  const campoValor = page.getByLabel("Valor (R$)");

  await campoTitulo.fill("Academia mensal");
  await campoValor.fill("120");
  await page.getByRole("button", { name: "Salvar despesa" }).click();

  // Mensagem de sucesso
  await expect(
    page.getByText("Despesa cadastrada com sucesso")
  ).toBeVisible();

  // Campos devem estar em branco
  await expect(campoTitulo).toHaveValue("");
  await expect(campoValor).toHaveValue("");
});
