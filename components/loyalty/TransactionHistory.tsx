import { formatDateTime } from "@/lib/utils/time";

interface Transaction {
  id: string;
  amount: number;
  reason: string;
  created_at: string;
}

export function TransactionHistory({ transactions }: { transactions: Transaction[] }) {
  if (!transactions.length) {
    return <p className="py-6 text-center text-sm text-[var(--color-muted)]">Noch keine Transaktionen.</p>;
  }

  return (
    <ul className="divide-y divide-[var(--color-border)]">
      {transactions.map((tx) => (
        <li key={tx.id} className="py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--color-text)]">{tx.reason}</p>
            <p className="text-xs text-[var(--color-muted)]">{formatDateTime(tx.created_at)}</p>
          </div>
          <span className={["font-mono font-semibold text-sm", tx.amount >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"].join(" ")}>
            {tx.amount >= 0 ? "+" : ""}{tx.amount} Pkt.
          </span>
        </li>
      ))}
    </ul>
  );
}
