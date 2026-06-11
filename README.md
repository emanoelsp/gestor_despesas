# Fluxo Financeiro — Base do Trabalho Prático TestOps CI/CD

Aplicação base para um trabalho prático de Qualidade de Software, TestOps e deploy controlado por Jenkins. O template usa Next.js 16, React 19, TailwindCSS 4 e Firebase Firestore, mas não entrega as features avaliadas: ele deixa as três entregas principais como scaffold com `TODO implement` para que a turma implemente, teste e publique via Jenkins

A lógica central da disciplina é simples: **se a feature não estiver provada por testes e pela pipeline, ela não deve chegar ao deploy.**

O trabalho é dividido em três semanas com ferramentas de teste diferentes — Cypress, Playwright e TestRigor — sempre com o Jenkins como gatekeeper do deploy na Vercel.

---
---

## Instruções detalhadas

Acesse o guia completo em `/instrucoes` dentro da aplicação. O módulo cobre:

| Rota | Conteúdo |
| --- | --- |
| `/instrucoes/jenkins` | CI/CD, Jenkinsfile real do projeto, webhook GitHub |
| `/instrucoes/deploy` | Vercel setup, Firebase env vars, credenciais Jenkins |
| `/instrucoes/todo` | Features a implementar + guia completo do OCR de nota fiscal |
| `/instrucoes/cypress` | Semana 1: ativar `@todo`, ver Jenkins falhar, implementar, pipeline verde |
| `/instrucoes/playwright` | Semana 2: migrar para Playwright, trocar stage no Jenkinsfile |
| `/instrucoes/testrigor` | Semana 3: testes em linguagem natural, tabela comparativa |
| `/instrucoes/relatorio` | Checklist por semana, estrutura do relatório, critérios |

---

## Mapa de entregas

### Semana 1 — Implementação com bloqueio de deploy (Cypress + Cucumber)

**Objetivo:** implementar as três features do scaffold e demonstrar que o Jenkins bloqueia o deploy enquanto os testes falham.

**O que fazer:**

1. Faça fork ou clone o repositório base.
2. Configure o Firebase, o Jenkins e o webhook do GitHub.
3. **Ative os cenários Cypress marcados com `@todo`** antes de concluir a implementação — o Jenkins deve falhar nesse ponto.
4. Capture os logs de falha e os screenshots que o Cypress gera automaticamente em `cypress/screenshots/`.
5. Implemente as features (veja a seção "O que os alunos precisam concluir" abaixo).
6. Faça os testes passarem, faça push e obtenha a pipeline verde com deploy liberado.

**Features a implementar:**

| Feature | Arquivo principal | O que está faltando |
| --- | --- | --- |
| 01 — Entradas | `src/services/income-entry-service.ts` | `createIncomeEntry()` e `subscribeToIncomeEntries()` |
| 02 — Saídas manuais | `src/services/expense-service.ts` | `createExpense()` |
| 03 — OCR de nota fiscal | `src/app/api/receipt-extraction/route.ts` | Integração com provedor de OCR e mapeamento do resultado |

**Cenários Cypress prontos (passando):**

```text
cypress/e2e/dashboard.feature              — 5 cenários
cypress/e2e/manual-expense-form.feature    — 5 cenários
cypress/e2e/income-entry-form.feature      — 5 cenários
cypress/e2e/receipt-upload-panel.feature   — 5 cenários
cypress/e2e/receipt-extraction-api.feature — 3 cenários (API)
```

**Stubs `@todo` para os alunos ativarem e completarem:**

```text
cypress/e2e/todo-create-expense.feature        — persistência Firestore (saídas)
cypress/e2e/todo-create-income-entry.feature   — persistência Firestore (entradas)
cypress/e2e/todo-ocr-extraction.feature        — OCR + salvamento
```

**Os 6 cenários obrigatórios (devem passar nas 3 semanas):**

1. Cadastro de entrada financeira — salva no Firestore e atualiza o card
2. Cadastro de saída manual — salva no Firestore e aparece na lista
3. Exclusão de despesa — remove da lista sem recarregar
4. Confirmação e limpeza — mensagem de sucesso + formulário em branco
5. Upload de nota fiscal — despesa criada automaticamente via OCR
6. Upload de nota fiscal — mensagem de sucesso exibida

**Evidências obrigatórias da Semana 1:**

- Print do Jenkins com pipeline vermelha (teste ativado antes da implementação).
- Log de erro completo do stage E2E Tests que bloqueou o deploy.
- Screenshots gerados pelo Cypress em `cypress/screenshots/` durante a falha.
- Print do Jenkins com pipeline verde após a correção.
- Print do deploy publicado na Vercel acionado pela pipeline verde.
- Os dois commits: o que ativou os testes (falha) e o que fez passar.
- Análise de causa raiz (RCA): por que o teste falhou e como o Jenkins protegeu a produção.

**Comandos da Semana 1:**

```bash
npm install
npm run test                  # Jest — testes unitários
npm run test:e2e              # Cypress + dev server (local)
npm run test:e2e:ci           # Cypress + next start (CI/Jenkins)
npm run cypress:open          # Cypress interativo
```

---

### Semana 2 — BDD com Playwright + Cucumber

**Objetivo:** substituir o stage Cypress pelo Playwright no Jenkinsfile e reescrever os 6 cenários obrigatórios em TypeScript com `async/await`.

**O que muda no Jenkinsfile:**

```groovy
// Remova:
stage("E2E Tests (Cypress + Cucumber)") { ... }

// Adicione:
stage("E2E Tests (Playwright + Cucumber)") {
  steps {
    sh "npx playwright install --with-deps chromium"
    sh "npm run test:e2e:playwright"
  }
  post {
    always {
      archiveArtifacts artifacts: "playwright-report/**/*", allowEmptyArchive: true
    }
  }
}
```

O stage continua bloqueando o deploy — só muda a ferramenta.

**O que muda em relação ao Cypress:**

| Aspecto | Cypress | Playwright |
| --- | --- | --- |
| Sintaxe | `cy.get().click()` | `await page.click()` |
| Async | Fila interna, sem await | `async/await` explícito |
| Browsers | Chromium/Electron | Chrome, Firefox, Safari |
| Relatório | Plugins externos | HTML report embutido |
| Debug | UI interativa própria | Trace Viewer (replay) |

**Evidências obrigatórias da Semana 2:**

- Os 6 cenários Gherkin (arquivos `.feature`) reescritos para o Playwright.
- Print do Jenkins com o stage Playwright falhando (antes de terminar).
- HTML report do Playwright com o trace do cenário que falhou.
- Print da pipeline verde com Playwright após implementar.
- Comparação objetiva: o que ficou mais claro? Qual foi mais expressivo?

---

### Semana 3 — Laboratório TestRigor (Low-Code)

**Objetivo:** escrever os mesmos 6 cenários em linguagem natural e desenvolver senso crítico sobre quando usar cada ferramenta.

**Importante:** o TestRigor **não é integrado ao Jenkins** nesta semana — é uma atividade comparativa independente.

**Exemplo de teste em linguagem natural:**

```text
open "https://seu-projeto.vercel.app"
click on "Saída Manual"
enter "Mercado semanal" into "Título da despesa"
enter "150" into "Valor (R$)"
click on "Salvar despesa"
check that page contains "Despesa cadastrada com sucesso."
```

**Comparação final (preencher no relatório):**

| Critério | Cypress | Playwright | TestRigor |
| --- | --- | --- | --- |
| Tempo para criar os 6 testes | — | — | — |
| Integração com Jenkins | Nativa | Nativa | Via API (limitada) |
| Manutenção quando UI muda | Frágil (seletores) | Frágil (seletores) | Resistente (IA) |
| Custo | Open-source | Open-source | Freemium (SaaS) |
| Controle técnico | Alto | Alto | Baixo |

**Evidências obrigatórias da Semana 3:**

- Print dos 6 testes escritos em linguagem natural no TestRigor.
- Print da execução (painel verde/vermelho).
- Tabela comparativa preenchida: Cypress × Playwright × TestRigor.
- Conclusão técnica: em qual cenário real de projeto cada ferramenta seria a escolha certa?

---

## Relatório PDF final — estrutura obrigatória

```text
1. Introdução
   - Contexto do projeto Fluxo Financeiro
   - Diagrama: código local → push → GitHub → webhook → Jenkins → Vercel

2. Semana 1 — Cypress + Cucumber
   - Implementação das features 01, 02 e 03
   - Evidência do Jenkins bloqueando o deploy (print + log)
   - Screenshots do Cypress durante a falha
   - Pipeline verde após correção
   - Análise de causa raiz (RCA)

3. Semana 2 — Playwright + Cucumber
   - Cenários reescritos em TypeScript
   - Jenkins bloqueando com Playwright
   - Pipeline verde com Playwright
   - Comparação direta com Cypress + HTML report

4. Semana 3 — TestRigor
   - Testes em linguagem natural
   - Print da execução no TestRigor
   - Tabela comparativa final
   - Conclusão: qual ferramenta para qual cenário

5. Conclusão geral
   - Lições aprendidas sobre TestOps e CI/CD
   - O que o grupo faria diferente em um projeto real
```

---

## Interface da aplicação

A aplicação usa uma interface com:

- **Header** com progresso de orçamento (dot-matrix de 32 pontos) e saldo disponível
- **3 cards de resumo**: Entradas, Despesas, Lançamentos
- **Gráfico de barras** comparando entradas vs despesas por mês
- **Lista de despesas** recentes com exclusão inline
- **3 formulários em abas**: Entradas, Saída Manual, Nota Fiscal
- **Módulo `/instrucoes`** com guia completo do trabalho

---

## O que já vem pronto

- Dashboard responsivo com resumo financeiro e lista de despesas.
- Estrutura visual das três features do trabalho.
- Hooks e serviços base para despesas, entradas e leitura de nota fiscal.
- Route Handler de OCR criado como ponto de extensão.
- `Jenkinsfile` com os estágios: Checkout, Install, Unit Tests, Build, E2E Tests, Deploy Vercel.
- **23 cenários Cypress + Cucumber prontos e passando** para as features já implementadas.
- Stubs `@todo` com descrição do que testar para cada desafio dos alunos.
- Módulo `/instrucoes` com guia completo das 3 semanas.

## O que os alunos precisam concluir

- Implementar o cadastro de entradas (Feature 01).
- Implementar o cadastro de saídas manuais (Feature 02).
- Finalizar a extração de nome do estabelecimento e valor a partir da nota fiscal (Feature 03).
- Persistir a saída extraída como despesa no Firestore.
- Completar a integração Jenkins → GitHub → Vercel sem expor secrets.
- Semana 2: migrar de Cypress para Playwright.
- Semana 3: escrever testes equivalentes no TestRigor e fazer a análise comparativa.

---

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencher variáveis Firebase
npm run dev                  # servidor de desenvolvimento
npm run test                 # Jest (unitários)
npm run test:e2e             # Cypress + dev server
npm run test:e2e:ci          # Cypress + next start (CI)
npm run cypress:open         # Cypress interativo
npm run lint
npm run build
```

---

## Firebase

Variáveis de ambiente esperadas:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

As despesas são gravadas na coleção `expenses`. A coleção de entradas e a estratégia de sincronização devem ser implementadas pela turma.

## Arquivos com `TODO implement`

```text
src/services/income-entry-service.ts     — createIncomeEntry, subscribeToIncomeEntries
src/services/expense-service.ts          — createExpense
src/app/api/receipt-extraction/route.ts  — integração OCR
src/services/receipt-upload.ts           — mapeamento do resultado OCR
Jenkinsfile                              — stage Deploy Vercel (credentials + Vercel CLI)
cypress/e2e/todo-create-expense.feature
cypress/e2e/todo-create-income-entry.feature
cypress/e2e/todo-ocr-extraction.feature
```
