# TODO implement: Desafio 1 — Persistência de saídas manuais no Firestore
#
# Pré-requisito: concluir createExpense() em src/services/expense-service.ts
# e configurar as variáveis NEXT_PUBLIC_FIREBASE_* no ambiente de testes.
#
# O que testar:
#   - Despesa salva aparece na lista "Lançamentos recentes" sem recarregar a página
#   - Saldo estimado diminui após salvar a despesa
#   - Formulário é limpo após o envio bem-sucedido
#   - Mensagem de confirmação "Despesa cadastrada com sucesso." é exibida
#   - Despesa excluída desaparece da lista em tempo real
#   - Valor negativo ou zero continua bloqueado mesmo com Firestore ativo

Feature: Persistência de saídas manuais no Firestore

  Background:
    Given que acesso a pagina inicial
    Then seleciono a aba "Saída Manual"

  Scenario: Despesa salva aparece na lista "Últimas despesas" sem recarregar a página
    When preencho o campo "Título da despesa" com "Mercado semanal"
    And preencho o campo "Valor (R$)" com "150"
    And preencho a "Data da compra" com uma data válida
    And seleciono a categoria "Alimentacao"
    Then clico no botão "SALVAR DESPESA"
    Then a despesa "Mercado semanal" no valor de "R$ 150" deve aparecer imediatamente na lista "Últimas despesas"

  Scenario: Saldo estimado diminui após salvar a despesa
    Given o saldo atual exibe "R$ 8.200,00"
    When preencho o campo "Título da despesa" com "Mercado semanal"
    And preencho o campo "Valor (R$)" com "200"
    And preencho a "Data da compra" com uma data válida
    And seleciono a categoria "Alimentacao"
    Then clico no botão "SALVAR DESPESA"
    And o contador de "Despesas" deve ter o valor "200,00"
    And o saldo atual exibe "R$ 8.000,00"

  Scenario: Formulário é limpo após o envio bem-sucedido
    When preencho o campo "Título da despesa" com "Mercado semanal"
    And preencho o campo "Valor (R$)" com "200"
    And preencho a "Data da compra" com uma data válida
    And seleciono a categoria "Alimentacao"
    Then clico no botão "SALVAR DESPESA"
    Then o campo "Título da despesa" deve voltar para "Ex.:Mercado semanal"
    And o campo "Valor (R$)" deve voltar para "0,00"
    And o campo "Categoria" deve voltar para "Alimentacao"

  Scenario: Mensagem de confirmação "Despesa cadastrada com sucesso." é exibida
    When envio um formulário de saída manual válido
    Then devo ver um toast ou notificação com a mensagem "Despesa cadastrada com sucesso."

  #Scenario: Despesa excluída desaparece da lista em tempo real
    Given que existe pelo menos uma despesa na lista "Últimas despesas"
    When eu clico no botão de excluir (lixeira) dessa despesa
    Then o registro deve desaparecer da lista imediatamente, sem recarregar a página
    And os valores de "Despesas" e "SALDO" devem ser recalculados automaticamente

  #Scenario: Valor negativo ou zero continua bloqueado mesmo com Firestore ativo
    When preencho o campo "Título da despesa" com "Compra inválida"
    When preencho o campo "Valor (R$)" com "-50,00"
    And clico no botão "SALVAR DESPESA"
    Then a requisição para o Firestore não deve ser enviada
    And o botão "SALVAR DESPESA" deve permanecer inativo ou exibir uma mensagem de erro de validação no campo de valor