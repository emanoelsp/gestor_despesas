# Fluxo Financeiro

Aplicacao base para um trabalho pratico de Qualidade de Software, TestOps e deploy controlado por Jenkins. O template usa Next.js App Router, React 19, TailwindCSS 4 e Firebase Firestore, mas nao entrega a solucao final: ele deixa os pontos criticos sinalizados com `TODO implement` para que a turma complete a atividade.

## O que ja vem pronto

- Dashboard responsivo com resumo financeiro e lista de despesas.
- Formulario manual funcional para registrar despesas no Firestore.
- Nova trilha de upload de nota fiscal por foto ou PDF antes da etapa de camera.
- Etapa futura de camera/OCR reservada para evolucao da atividade.
- Scaffold de `Jenkinsfile` com os estagios obrigatorios do trabalho.
- Testes unitarios iniciais com Jest e React Testing Library.

## O que os alunos precisam concluir

- Finalizar a extracao de `nome do estabelecimento` e `valor` a partir da nota fiscal enviada.
- Persistir a saida extraida como despesa no Firestore.
- Reaproveitar a mesma trilha de extracao no fluxo de camera.
- Completar a integracao Jenkins -> GitHub -> Vercel sem expor secrets.
- Ativar e fazer passar os testes marcados com `test.skip` no fluxo planejado do trabalho.

## Arquivos com `TODO implement`

- `Jenkinsfile`
- `src/components/receipt-upload-panel.tsx`
- `src/services/receipt-upload.ts`
- `src/app/api/receipt-extraction/route.ts`
- `src/components/camera-scan-panel.tsx`
- `src/__tests__/receipt-upload.test.ts`
- `src/__tests__/camera-scan-panel.test.tsx`
- `docs/TODO_IMPLEMENTATION_MAP.md`

## Estrutura

```text
docs/
src/
  app/
  components/
  services/
  __tests__/
Jenkinsfile
```

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Crie um arquivo `.env.local` usando `.env.example` como base:

```bash
cp .env.example .env.local
```

3. Preencha as variaveis do Firebase e, se a sua turma optar por OCR externo, as variaveis server-side do provedor escolhido.

4. Rode a aplicacao:

```bash
npm run dev
```

5. Execute os checks locais:

```bash
npm run lint
npm run test
npm run build
```

## Firebase

O projeto espera as seguintes variaveis de ambiente publicas:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

As despesas sao gravadas na colecao `expenses`.

## OCR e Upload de Nota

O fluxo novo de upload aceita PDF e imagens e leva o arquivo ate a rota `src/app/api/receipt-extraction/route.ts`. A base atual valida o arquivo, exibe feedback na interface e deixa a extracao real como atividade dos alunos.

## Jenkins e Vercel

- `Jenkinsfile` ja contem os estagios `Checkout`, `Install`, `Unit Tests`, `Build` e `Deploy Vercel`.
- O bloco de deploy foi mantido como scaffold com `TODO implement` para que a turma configure credentials e a estrategia final de publicacao.
- `vercel.json` ja identifica o projeto como `nextjs`.

## Testes incluidos

- Validacao do formulario manual quando os campos obrigatorios estao vazios.
- Envio do formulario manual com payload normalizado e limpeza dos campos.
- Validacao do fluxo de upload de nota fiscal.
- Esqueleto `test.skip` para a extracao OCR por upload.
- Esqueleto `test.skip` para a captura pela camera.
