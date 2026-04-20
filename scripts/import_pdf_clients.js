import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Extrair dados base da string de input formatada
const parsedClients = [
{"name":"Deyvison Gomes Dos Santos","cpfCnpj":"49.275.843/0001-90","phone":"(31)9554-9149","email":"deyvisongomo@gmail.com","createdAt":"2024-07-05T00:00:00.000Z"},
{"name":"ABBA ATACADOS","cpfCnpj":"","phone":"","email":"","createdAt":"2023-11-13T00:00:00.000Z"},
{"name":"Adalberto Pereira Silva","cpfCnpj":"","phone":"98 87560358","email":"","createdAt":"2024-02-14T00:00:00.000Z"},
{"name":"Adalmi de Souza","cpfCnpj":"","phone":"","email":"","createdAt":"2025-09-04T00:00:00.000Z"},
{"name":"Adalton Neto Carneiro","cpfCnpj":"067.670.916-85","phone":"(31)99837-5453","email":"","createdAt":"2024-02-21T00:00:00.000Z"},
{"name":"Adeide Passos","cpfCnpj":"","phone":"(31)97109-3445","email":"","createdAt":"2024-04-24T00:00:00.000Z"},
{"name":"Adelaide Tavares Leal","cpfCnpj":"","phone":"(31)99569-1905","email":"","createdAt":"2024-06-25T00:00:00.000Z"},
{"name":"Aderlande Calazans","cpfCnpj":"","phone":"(31)98213-0089","email":"","createdAt":"2024-05-22T00:00:00.000Z"},
{"name":"Adilson Fernandes Ferreira","cpfCnpj":"903.334.036-49","phone":"","email":"","createdAt":"2025-03-18T00:00:00.000Z"},
{"name":"Adrian Henrique da Silva Santos","cpfCnpj":"129.253.436-27","phone":"","email":"","createdAt":"2024-10-15T00:00:00.000Z"},
{"name":"Adriana Aparecida de Fatima","cpfCnpj":"074.459.906-74","phone":"","email":"","createdAt":"2023-07-05T00:00:00.000Z"},
{"name":"Adriano Alves","cpfCnpj":"132.142.836-77","phone":"","email":"","createdAt":"2024-01-18T00:00:00.000Z"},
{"name":"adriano de paula c.","cpfCnpj":"065.176.976-08","phone":"(31)9794-5737","email":"alanbrunocons@gmail.com","createdAt":"2024-06-07T00:00:00.000Z"},
{"name":"Adriano de Paula Soares","cpfCnpj":"074.204.346-03","phone":"","email":"","createdAt":"2026-03-03T00:00:00.000Z"},
{"name":"Adriano Vinicius Verspeet","cpfCnpj":"","phone":"","email":"","createdAt":"2024-07-22T00:00:00.000Z"},
{"name":"Adriele Flaviana Souza","cpfCnpj":"123.413.536-14","phone":"(31)3558-5582","email":"","createdAt":"2024-09-24T00:00:00.000Z"},
{"name":"AENDER ROGERS GONÇALVES","cpfCnpj":"935.340.196-87","phone":"","email":"","createdAt":"2023-09-26T00:00:00.000Z"},
{"name":"afranio de oliveira","cpfCnpj":"074.663.286-01","phone":"(31)98438-2162","email":"","createdAt":"2024-03-02T00:00:00.000Z"},
{"name":"Agnaldo Elias","cpfCnpj":"","phone":"","email":"","createdAt":"2025-11-29T00:00:00.000Z"},
{"name":"Ailton balcino de almeida","cpfCnpj":"106.274.286-90","phone":"(31)99311-7056","email":"","createdAt":"2024-02-01T00:00:00.000Z"},
{"name":"Alan Cardenas","cpfCnpj":"","phone":"(31)98315-0310","email":"","createdAt":"2024-08-23T00:00:00.000Z"},
{"name":"ALAN KELERSON","cpfCnpj":"161.636.466-14","phone":"","email":"","createdAt":"2025-10-20T00:00:00.000Z"},
{"name":"alan max","cpfCnpj":"","phone":"(31)98462-9152","email":"","createdAt":"2024-03-14T00:00:00.000Z"},
{"name":"ALAN MAX ROCK DE SOUZA","cpfCnpj":"","phone":"","email":"","createdAt":"2023-11-13T00:00:00.000Z"},
{"name":"Alessandro","cpfCnpj":"","phone":"31 9846-3436","email":"","createdAt":"2024-08-06T00:00:00.000Z"},
{"name":"ALEX (MEGA)","cpfCnpj":"","phone":"","email":"","createdAt":"2023-11-13T00:00:00.000Z"},
{"name":"Alex Arlindo Gonçalves","cpfCnpj":"108.511.016-82","phone":"(31)9984-0379","email":"","createdAt":"2026-02-23T00:00:00.000Z"},
{"name":"Alex da Silva Anselmo Rodrigues","cpfCnpj":"078.249.686-50","phone":"(31)99293-5295","email":"","createdAt":"2025-04-29T00:00:00.000Z"},
{"name":"Alex Fernades Cação","cpfCnpj":"","phone":"","email":"","createdAt":"2025-04-05T00:00:00.000Z"},
{"name":"Alex Ferreira","cpfCnpj":"","phone":"(32)99844-8414","email":"","createdAt":"2024-07-09T00:00:00.000Z"},
{"name":"Alex Martins Da Costa","cpfCnpj":"126.581.576-30","phone":"","email":"","createdAt":"2026-01-16T00:00:00.000Z"},
{"name":"alex sandro piu","cpfCnpj":"041.140.116-50","phone":"(31)98876-4925","email":"","createdAt":"2024-03-04T00:00:00.000Z"},
{"name":"alexandre antunes","cpfCnpj":"","phone":"","email":"","createdAt":"2025-07-28T00:00:00.000Z"},
{"name":"Alexandre aparecida santana","cpfCnpj":"","phone":"(31)98362-6787","email":"","createdAt":"2024-04-22T00:00:00.000Z"},
{"name":"Alexer André Ferreira Peixoto","cpfCnpj":"108.669.356-65","phone":"","email":"","createdAt":"2024-09-13T00:00:00.000Z"},
{"name":"ALEXSANDER PEREIRA FIDELIS","cpfCnpj":"131.212.136-01","phone":"","email":"","createdAt":"2023-07-05T00:00:00.000Z"},
{"name":"Alexsandra Fátima Martins","cpfCnpj":"083.829.987-39","phone":"","email":"","createdAt":"2025-05-30T00:00:00.000Z"},
{"name":"ALINE - A BATERIA","cpfCnpj":"","phone":"","email":"","createdAt":"2023-11-13T00:00:00.000Z"},
{"name":"ALINE A BATERIA","cpfCnpj":"","phone":"","email":"","createdAt":"2023-11-13T00:00:00.000Z"},
{"name":"Aline de Fátima Borges de Oliveira","cpfCnpj":"107.338.776-30","phone":"(31)99529-8567","email":"","createdAt":"2024-12-20T00:00:00.000Z"},
{"name":"aline tatiana","cpfCnpj":"115.515.456-83","phone":"(33)9949-4557","email":"","createdAt":"2023-12-15T00:00:00.000Z"},
{"name":"Aloízo Petronio Leoncio","cpfCnpj":"076.066.766-74","phone":"","email":"","createdAt":"2024-10-16T00:00:00.000Z"}
]

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const CLIENTS_COL = collection(db, "clients");

async function importClients() {
  const defaults = {
    address: { street: "", number: "", neighborhood: "", city: "", state: "", zipCode: "" }
  }
  
  for(let client of parsedClients) {
    try {
      await addDoc(CLIENTS_COL, { ...client, ...defaults });
      console.log("imported: " + client.name);
    } catch(err) {
      console.log("Failed " + client.name, err);
    }
  }
}
importClients();
