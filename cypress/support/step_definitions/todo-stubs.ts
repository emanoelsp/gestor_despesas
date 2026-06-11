import { Given, Then } from "@badeball/cypress-cucumber-preprocessor";

// Steps provisorios usados nos cenarios @todo para que o Cucumber parse os arquivos
// sem erros de "step not found". Substitua pelo step real ao implementar cada cenario.
Given("pendente de implementacao", () => {
  cy.log("TODO: este cenario ainda nao foi implementado.");
});

Then("a mensagem {string} é exibida", ( mensagem: string ) => {
  cy.wait(1000);
  cy.contains(mensagem)
});

Then("o campo {string} deve limpar", ( campo: string ) => {
  cy.wait(1000);
  cy.contains(campo).parent().find("input").should("be.empty");
});

Then("recarregar a página", () => {
  cy.wait(1000);
  cy.reload();
});

Then("exclui a despesa {string}", (titulo: string) => {
  cy.wait(1000);
  cy.contains(titulo).parent().find("button").click();
});

Then("verifica se a lista de despesas está vazia", () => {
  cy.wait(1000);
  cy.contains("As saídas cadastradas via formulário ou upload de nota aparecerão aqui.");
});
