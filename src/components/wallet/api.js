import { apiRequest } from "../../lib/api";

export async function getBalance(token) {
  return apiRequest("/wallet/balance", "GET", null, token);
}

export async function getTransactions(token) {
  return apiRequest("/wallet/transactions", "GET", null, token);
}

export async function sendMoney(token, toUser, amount) {
  return apiRequest("/wallet/transfer", "POST", { toUser, amount }, token);
}

export async function topUp(token, amount) {
  return apiRequest("/wallet/deposit", "POST", { amount }, token);
}
