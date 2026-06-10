import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

Given("que acesso a pagina inicial", () => {
  cy.visit("/");
});

Given("o saldo atual exibe {string}", (saldo: string) => {
  cy.contains("Saldo").parent().contains(saldo);
});

Then("vejo o texto {string}", (text: string) => {
  cy.contains(text).should("be.visible");
});

Then("vejo o heading {string}", (text: string) => {
  cy.contains("h2", text).should("be.visible");
});

Then("vejo o card com titulo {string}", (title: string) => {
  cy.contains(title).should("be.visible");
});

Then("vejo o label {string}", (label: string) => {
  cy.contains("label", label).should("be.visible");
});

Then("vejo o botao {string}", (text: string) => {
  cy.contains("button", text).should("be.visible");
});

Then("vejo o erro de validacao {string}", (message: string) => {
  cy.contains(message).should("be.visible");
});

Then("vejo o alerta {string}", (message: string) => {
  cy.contains('[role="alert"]', message).should("be.visible");
});

When("clico no botao {string}", (text: string) => {
  cy.contains("button", text).click();
});
