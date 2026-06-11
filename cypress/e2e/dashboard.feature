Feature: Dashboard principal

  Background:
    Given que acesso a pagina inicial

  Scenario: Exibe os tres cards de resumo financeiro
    Then vejo o card com titulo "Entradas"
    And vejo o card com titulo "Despesas"
    And vejo o card com titulo "Lançamentos"

  Scenario: Exibe a descricao do projeto com os tres desafios
    Then vejo o texto "Gastos vs. Entradas"

  Scenario: Exibe o saldo estimado na secao de orcamento
    Then vejo o texto "Saldo projetado"

  Scenario: Exibe a barra de progresso do orcamento
    Then vejo o texto "Entradas previstas"

  Scenario: Exibe o titulo principal do sistema
    Then vejo o texto "Gastos acumulados"
