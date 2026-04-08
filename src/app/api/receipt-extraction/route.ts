import {
  getReceiptFileValidationMessage,
  getSupportedReceiptTypesLabel,
} from "@/services/receipt-upload";

export async function POST(request: Request) {
  const formData = await request.formData();
  const receipt = formData.get("receipt");

  if (!(receipt instanceof File)) {
    return Response.json(
      {
        error: "Envie um arquivo no campo `receipt` para iniciar a extracao.",
      },
      { status: 400 },
    );
  }

  const validationMessage = getReceiptFileValidationMessage(receipt);

  if (validationMessage) {
    return Response.json(
      {
        error: validationMessage,
      },
      { status: 415 },
    );
  }

  // TODO implement: ler o binario da nota fiscal enviada.
  // TODO implement: integrar um provedor ou estrategia de OCR.
  // TODO implement: extrair establishmentName e amount.
  // TODO implement: normalizar o contrato de retorno para o cliente.
  return Response.json(
    {
      acceptedTypes: getSupportedReceiptTypesLabel(),
      error:
        "TODO implement: conclua a extracao da nota fiscal nesta rota antes de salvar a despesa.",
      expectedFields: [
        "establishmentName",
        "amount",
        "purchaseDate",
        "suggestedCategory",
      ],
    },
    { status: 501 },
  );
}
