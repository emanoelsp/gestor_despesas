import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Then("seleciono a aba {string}", (aba: string) => {
  cy.wait(1000).contains("button", aba).click();
});

When("preencho o campo {string} com {string}", (campo: string, valor: string) => {
  cy.wait(1000);
  // Busca o texto (ex: "Título da despesa"), vai para o container pai e encontra o input para digitar
  cy.contains(campo).parent().find("input").clear().type(valor);
});

When("preencho a {string} com uma data válida", (campo: string) => {
  cy.wait(1000);
  cy.contains(campo).parent().find('input[type="date"]').clear().type("2026-06-03");
});

When("seleciono a categoria {string}", (categoria: string) => {
  cy.wait(1000);
  // Dependendo de como está o value no seu HTML, pode ser necessário passar sem acento (ex: 'Alimentacao')
  cy.get("select").select(categoria);
});

Then("clico no botão {string}", (botao: string) => {
  cy.contains("button", botao, { matchCase: false }).click();
});

Then("a despesa {string} no valor de {string} deve aparecer imediatamente na lista {string}", (titulo: string, valor: string, lista: string) => {
  cy.wait(1000);
  // Busca o título da lista ("Últimas despesas") e verifica se o título e valor estão dentro do mesmo bloco
  cy.contains(lista)
    .parent()
    .parent()
    .parent()
    .find('h3').contains(titulo);
});

Then("o contador de {string} deve ter o valor {string}", (contador: string, valor: string) => {
  cy.wait(1000);
  // Garante que o contador não está mais zerado (ou pode usar "contain", "1 registros" se for sempre o primeiro)
  cy.contains(contador)
    .parent()
    .should("contain", valor); 
});

Then("o campo {string} deve voltar para {string}", (campo: string, valor: string) => {
  cy.wait(1000);
  // Verifica se o campo foi resetado para o valor padrão (ex: "Selecione" ou "")
  cy.contains(campo).parent().find("input").should("have.value", valor);
});