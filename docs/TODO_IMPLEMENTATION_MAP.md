# TODO implement - Mapa das Atividades

Este repositorio foi preparado para apoiar um trabalho pratico de Jenkins, TestOps e evolucao de funcionalidades. O objetivo nao e entregar a solucao pronta, e sim deixar os pontos de extensao organizados para a turma.

## Aplicacao

- `src/components/receipt-upload-panel.tsx`
  - concluir a experiencia de upload da nota fiscal
  - exibir os dados extraidos antes da gravacao final
- `src/services/receipt-upload.ts`
  - transformar a resposta da API de OCR em uma despesa valida
  - decidir as regras de categoria, data e fallback
- `src/app/api/receipt-extraction/route.ts`
  - integrar um provedor ou estrategia de OCR
  - extrair `establishmentName` e `amount`
  - devolver um contrato JSON consistente para o cliente
- `src/components/camera-scan-panel.tsx`
  - capturar imagem em tempo real
  - reaproveitar o fluxo de extracao iniciado no upload

## Qualidade e Testes

- `src/__tests__/receipt-upload.test.ts`
  - remover o `skip`
  - fazer o teste falhar no momento planejado do trabalho
  - corrigir a implementacao ate o teste passar
- `src/__tests__/camera-scan-panel.test.tsx`
  - ativar o teste quando a captura ao vivo estiver pronta

## Infraestrutura

- `Jenkinsfile`
  - cadastrar credentials seguras
  - completar o deploy na Vercel
  - garantir que testes e build bloqueiem a publicacao
- `.env.example`
  - revisar se a estrategia de OCR vai exigir variaveis server-side adicionais

## Sugestao de fluxo didatico

1. Rodar a base localmente e entender os componentes existentes.
2. Configurar o Jenkins para clonar, instalar, testar e buildar o projeto.
3. Ativar o teste de OCR por upload sem concluir a implementacao.
4. Registrar a falha do pipeline no Jenkins.
5. Implementar a extracao e repetir o push ate a pipeline liberar o deploy.
