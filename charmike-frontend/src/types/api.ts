export interface UserSummary {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface AgentSummary {
  id: string;
  agent_code: string;
  is_active: boolean;
  user: UserSummary;
  created_at: string;
}

export interface Agent extends AgentSummary {
  clients_count?: number;
  loans_count?: number;
}

export interface ClientSummary {
  id: string;
  national_id: string;
  credit_limit: string;
  user: UserSummary;
  agent?: AgentSummary;
  created_at: string;
}

export type LoanStatus =
  | "pending"
  | "approved"
  | "active"
  | "completed"
  | "defaulted"
  | "rejected";

export interface Loan {
  id: string;
  principal: string;
  interest_rate: string;
  interest_amount: string;
  total_due: string;
  amount_paid: string;
  balance: string;
  status: LoanStatus;
  disbursement_reference: string | null;
  approved_at: string | null;
  disbursed_at: string | null;
  due_date: string | null;
  client: ClientSummary;
  agent: AgentSummary;
  payments?: Payment[];
  created_at: string;
}

export interface Payment {
  id: string;
  amount: string;
  payment_date: string;
  reference: string;
  notes: string | null;
  recorded_by?: UserSummary;
  loan?: Loan;
  created_at: string;
}

export interface LoanApplication {
  id: string;
  amount_requested: string;
  duration_days: number;
  status: string;
  rejection_reason: string | null;
  client: ClientSummary;
  loan?: Loan | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface DashboardStats {
  total_clients: number;
  total_agents: number;
  total_loans: number;
  active_loans: number;
  completed_loans: number;
  defaulted_loans: number;
  total_principal_disbursed: number;
  total_repayments_collected: number;
  outstanding_balance: number;
  total_commissions: number;
}

export interface AgentDashboardStats {
  total_clients: number;
  total_loans: number;
  active_loans: number;
  total_portfolio_value: number;
  total_collections: number;
  earned_commissions: number;
  paid_commissions: number;
  pending_commissions: number;
}

export interface Commission {
  id: string;
  amount: string;
  rate: string;
  month: number;
  year: number;
  status: "pending" | "paid" | string;
  paid_at: string | null;
  loan: Loan;
  created_at: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
