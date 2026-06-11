import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Diretório onde ficam os specs
  testDir: "./playwright",

  // Timeout por teste (ms)
  timeout: 30_000,

  // Timeout para expect()
  expect: {
    timeout: 10_000,
  },

  // Roda cada arquivo em sequência para evitar concorrência no Firestore
  fullyParallel: false,
  workers: 1,

  // Falha rápida no CI — não retenta
  retries: process.env.CI ? 0 : 0,

  // Relatório HTML embutido (arquivado pelo Jenkins)
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],

  use: {
    // Endereço da aplicação em execução local/CI
    baseURL: process.env.BASE_URL ?? "http://localhost:3000",

    // Captura trace sempre (útil para debug no relatório HTML)
    trace: "on",

    // Screenshot apenas em caso de falha
    screenshot: "only-on-failure",

    // Vídeo apenas em caso de falha
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Não sobe servidor — o Jenkins/dev já garante que a app está rodando
  // webServer pode ser habilitado para uso local:
  // webServer: {
  //   command: "npm run dev",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: true,
  // },
});
