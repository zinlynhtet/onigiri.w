// ─── Shared Type Definitions ───

export interface Transaction {
  sender: string;
  receiver: string;
  amount: number;
  timestamp: string;
  is_genesis: boolean;
}

export interface Block {
  position: number;
  data: Transaction[];
  timestamp: string;
  hash: string;
  prev_hash: string;
  nonce: number;
}

export interface AuthResponse {
  token: string;
  username: string;
  wallet_address: string;
}

export interface BalanceResponse {
  address: string;
  balance: number;
  sent: number;
  received: number;
}
