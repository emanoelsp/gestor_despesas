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

Feature: Criação de saída manual no Firestore

  Background:
    Given que acesso a pagina inicial

  Scenario: Salva uma saida manual com dados validos e exibe na lista
    When preencho o título com "Mercado semanal"
    And preencho o valor com "150.00"
    And seleciono a categoria "Alimentação"
    And clico em "Salvar despesa"
    Then vejo "Mercado semanal" na lista de lançamentos recentes
    And o card "Despesas" é atualizado com o novo total

  Scenario: Exibe confirmacao e limpa o formulario apos salvar
    When preencho o título com "Farmácia"
    And preencho o valor com "50.00"
    And seleciono a categoria "Saúde"
    And clico em "Salvar despesa"
    Then vejo a mensagem "Despesa cadastrada com sucesso."
    And os campos título e valor estão em branco

  Scenario: Permite excluir uma saida existente da lista
    Given que existe uma despesa "Padaria" na lista
    When clico no botão de excluir da despesa "Padaria"
    Then a despesa "Padaria" não deve mais aparecer na lista
