# TODO implement: Desafio 1 — Persistência de entradas no Firestore
#
# Pré-requisito: concluir createIncomeEntry() em src/services/income-entry-service.ts
# e subscribeToIncomeEntries() para sincronização em tempo real.
#
# O que testar:
#   - Entrada salva reflete no card "Entradas" sem recarregar
#   - Saldo estimado aumenta após salvar uma entrada
#   - Formulário é limpo e mensagem de confirmação aparece
#   - Entradas persistem após recarregar a página (Firestore em tempo real)
#   - Valor zero ou negativo continua bloqueado com Firebase ativo

Feature: Criação de entrada financeira no Firestore

  Background:
    Given que acesso a pagina inicial

  Scenario: Salva uma entrada e atualiza o card de entradas
    Then seleciono a aba "Entradas"
    When preencho o campo "Descrição da entrada" com "Salário de abril"
    And preencho o campo "Valor (R$)" com "100"
    And preencho a "Data" com uma data válida
    And seleciono a categoria "Salario"
    Then clico no botão "SALVAR ENTRADA"
    And o contador de "Entradas" deve ter o valor "100,00"
    Then a mensagem "Entrada cadastrada com sucesso." é exibida
    And o campo "Descrição da entrada" deve limpar
    And o campo "Valor (R$)" deve limpar
    Then recarregar a página
    And o contador de "Entradas" deve ter o valor "100,00"
  
  Scenario: Salva uma saida e atualiza o card de saidas
    Then seleciono a aba "Saída Manual"
    When preencho o campo "Título da despesa" com "Mercado semanal"
    And preencho o campo "Valor (R$)" com "100"
    And preencho a "Data" com uma data válida
    And seleciono a categoria "Alimentacao"
    Then clico no botão "SALVAR DESPESA"
    And o contador de "Despesas" deve ter o valor "100,00"
    Then a mensagem "Despesa cadastrada com sucesso." é exibida
    And o campo "Título da despesa" deve limpar
    And o campo "Valor (R$)" deve limpar
    Then recarregar a página
    And o contador de "Despesas" deve ter o valor "100,00"

  Scenario: Excluir uma despesa
    Then exclui a despesa "Mercado semanal"
    Then verifica se a lista de despesas está vazia
