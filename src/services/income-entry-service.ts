import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import {
  getFirestoreDatabase,
  getMissingFirebaseEnvironmentVariables,
  isFirebaseConfigured,
} from "@/services/firebase";
import type {
  IncomeEntry,
  IncomeEntryInput,
} from "@/services/income-entry-types";

export class FirestoreConfigurationError extends Error {
  constructor() {
    const missingEnvironmentVariables =
      getMissingFirebaseEnvironmentVariables().join(", ");

    super(
      `Firestore indisponível. Configure as variáveis ${missingEnvironmentVariables} para habilitar a persistência.`,
    );
    this.name = "FirestoreConfigurationError";
  }
}

const incomeEntriesCollectionName = "incomes";

function getIncomeEntriesCollection() {
  const database = getFirestoreDatabase();

  if (!database) {
    throw new FirestoreConfigurationError();
  }

  return collection(database, incomeEntriesCollectionName);
}

export async function createIncomeEntry(incomeEntry: IncomeEntryInput): Promise<IncomeEntry> {
  // Validar regras de negócio antes de salvar.
  if (!incomeEntry.title || !incomeEntry.title.trim()) {
    throw new Error("A descrição da entrada é obrigatória.");
  }
  if (typeof incomeEntry.amount !== "number" || Number.isNaN(incomeEntry.amount) || incomeEntry.amount <= 0) {
    throw new Error("O valor da entrada deve ser maior que zero.");
  }
  if (!incomeEntry.source || !incomeEntry.source.trim()) {
    throw new Error("A origem da entrada é obrigatória.");
  }
  if (!incomeEntry.date) {
    throw new Error("A data da entrada é obrigatória.");
  }

  // Persistir entradas no Firestore em uma coleção dedicada.
  const incomeEntriesCollection = getIncomeEntriesCollection();
  const documentReference = await addDoc(incomeEntriesCollection, {
    amount: Number(incomeEntry.amount),
    date: incomeEntry.date,
    source: incomeEntry.source,
    title: incomeEntry.title.trim(),
    createdAt: new Date().toISOString(),
  });

  // Devolver o registro criado para refletir no dashboard.
  return {
    id: documentReference.id,
    amount: Number(incomeEntry.amount),
    date: incomeEntry.date,
    source: incomeEntry.source,
    title: incomeEntry.title.trim(),
  };
}

export function subscribeToIncomeEntries(
  onIncomeEntriesChange: (entries: IncomeEntry[]) => void,
) {
  if (!isFirebaseConfigured()) {
    onIncomeEntriesChange([]);
    return () => undefined;
  }

  try {
    const incomeEntriesCollection = getIncomeEntriesCollection();
    const incomeEntriesQuery = query(
      incomeEntriesCollection,
      orderBy("createdAt", "desc")
    );

    // Sincronizar a coleção de entradas com o Firestore.
    return onSnapshot(
      incomeEntriesQuery,
      (snapshot) => {
        const entries = snapshot.docs.map((snapshotDocument) => {
          const documentData = snapshotDocument.data();

          return {
            id: snapshotDocument.id,
            amount: Number(documentData.amount ?? 0),
            date: String(documentData.date ?? ""),
            source: String(documentData.source ?? "Outros"),
            title: String(documentData.title ?? ""),
          };
        });

        onIncomeEntriesChange(entries);
      },
      (error) => {
        console.error("Erro ao sincronizar entradas financeiras:", error);
        onIncomeEntriesChange([]);
      }
    );
  } catch (error) {
    console.error("Erro ao configurar sincronização de entradas financeiras:", error);
    onIncomeEntriesChange([]);
    return () => undefined;
  }
}
