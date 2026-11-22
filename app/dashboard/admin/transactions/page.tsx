"use client"

import { useMemo, useState } from "react"
import {
  Search,
  Receipt,
  Landmark,
  RefreshCw,
  Crown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useApi } from "@/lib/hooks/use-api"
import { IndexPanel, StatusChip, Colophon } from "@/components/dashboard/shared"
import type { PaymentTransaction } from "@/lib/api-types"

function formatDate(iso: string | undefined): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminTransactionsPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (search.trim()) params.set("search", search.trim())
    params.set("page", String(page))
    params.set("limit", "20")
    return params.toString()
  }, [search, page])

  const api = useApi<PaymentTransaction[]>(`/api/admin/transactions?${query}`)
  const transactions = useMemo(() => api.data ?? [], [api.data])
  const loading = api.loading && !api.data
  const error = api.error
  const pagination = api.pagination

  const totalRevenue = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0)
  }, [transactions])

  return (
    <div className="terminal-root relative bg-[#F1EDE2] text-[#10181A]">
      <style>{`
        .terminal-serif { font-family: Georgia, 'Times New Roman', Times, serif; }
        .terminal-root ::selection { background: #C9A25E; color: #10181A; }
      `}</style>

      {/* ══ MASTHEAD ══════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b-4 border-[#D8C9A3] bg-[#10181A] text-[#EDE8DA]">
        <div className="relative mx-auto max-w-[1280px] px-4 pb-6 pt-6 sm:px-6 sm:pt-7 lg:px-8 lg:pb-7">
          <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="font-mono text-[9px] uppercase tracking-[0.34em] text-[#D8C9A3]">
                [ The Trust Office — Stripe Payment Ledger ]
              </p>
              <h1 className="terminal-serif mt-2.5 text-4xl font-black leading-[0.92] tracking-[-0.035em] text-[#F2EDDF] sm:text-5xl lg:text-6xl">
                Transactions
                <span className="block italic text-[#C9A25E]">
                  Audit Ledger.
                </span>
              </h1>
              <p className="mt-3 max-w-xl font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#EDE8DA]/65">
                Every verified Stripe checkout session, subscription charge, and transaction identifier recorded in real time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:col-span-4 lg:justify-end">
              <div className="border border-[#D8C9A3]/30 bg-[#141E1B] px-4 py-2.5 text-right font-mono">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#D8C9A3]/70">Page Volume</span>
                <p className="terminal-serif text-xl font-black text-[#F2EDDF]">
                  ${totalRevenue.toLocaleString()} <span className="text-xs font-normal text-[#D8C9A3]">USD</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        {/* ══ Filter Bar ════════════════════════════════════════════════ */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#10181A]/15 pb-4">
          <div className="relative w-full max-w-sm">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#10181A]/40" />
            <Input
              type="search"
              placeholder="Search email, name or plan…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="h-9 border-[#10181A]/20 bg-[#FCFAF2] pl-9 font-mono text-xs text-[#10181A] placeholder:text-[#10181A]/40 focus:border-[#C9A25E]"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => api.refetch()}
            className="h-9 rounded-sm border-[#10181A]/25 bg-transparent font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#10181A] hover:bg-[#10181A]/5"
          >
            <RefreshCw aria-hidden="true" className="mr-1.5 size-3.5" />
            Refresh Ledger
          </Button>
        </div>

        {/* ══ Transactions Table / List ════════════════════════════════ */}
        <IndexPanel
          tab="Ledger Entries"
          meta={`${pagination?.total ?? transactions.length} verified records`}
        >
          {loading ? (
            <div className="py-12 text-center font-mono text-xs text-[#10181A]/60">
              Opening the transaction ledger…
            </div>
          ) : error ? (
            <div className="py-8 text-center text-[#A34343]">
              <p className="font-mono text-xs uppercase tracking-wider">{error}</p>
              <Button
                type="button"
                size="sm"
                onClick={() => api.refetch()}
                className="mt-3 font-mono text-[9px] uppercase"
              >
                Retry
              </Button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center">
              <Receipt aria-hidden="true" className="mx-auto size-10 text-[#C9A25E]/60" />
              <p className="terminal-serif mt-3 text-lg font-bold">No transactions found</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[#10181A]/50">
                {search.trim() ? "No transaction records match this query." : "The payment ledger is currently empty."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#10181A]/15 text-[9px] uppercase tracking-[0.2em] text-[#10181A]/55">
                    <th className="pb-3 pr-4">Transaction ID / Reference</th>
                    <th className="pb-3 pr-4">Payer</th>
                    <th className="pb-3 pr-4">Role</th>
                    <th className="pb-3 pr-4">Plan / Tier</th>
                    <th className="pb-3 pr-4 text-right">Amount</th>
                    <th className="pb-3 pr-4 text-center">Status</th>
                    <th className="pb-3 text-right">Settled At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#10181A]/10">
                  {transactions.map((tx) => (
                    <tr key={tx._id || tx.transactionId} className="hover:bg-[#C9A25E]/5 transition-colors">
                      <td className="py-3.5 pr-4">
                        <span className="font-bold text-[#10181A] block">{tx.transactionId}</span>
                        {tx.stripeSessionId && (
                          <span className="text-[9px] text-[#10181A]/40 block truncate max-w-[180px]">
                            {tx.stripeSessionId}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="font-bold text-[#10181A] block">{tx.userName}</span>
                        <span className="text-[10px] text-[#10181A]/60 block">{tx.userEmail}</span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="uppercase text-[9px] tracking-wider text-[#10181A]/70">
                          {tx.userRole}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-flex items-center gap-1 font-bold text-[#B87959]">
                          <Crown className="size-3 text-[#C9A25E]" />
                          {tx.planName}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-right">
                        <span className="font-bold text-[#10181A]">
                          ${tx.amount}
                        </span>
                        <span className="text-[9px] text-[#10181A]/50 uppercase ml-1">
                          {tx.currency}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-center">
                        <StatusChip tone={tx.paymentStatus === "paid" ? "sage" : "terracotta"}>
                          {tx.paymentStatus.toUpperCase()}
                        </StatusChip>
                      </td>
                      <td className="py-3.5 text-right text-[10px] text-[#10181A]/65">
                        {formatDate(tx.paidAt || tx.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-[#10181A]/10 pt-3 font-mono text-[10px]">
              <span className="text-[#10181A]/55">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 text-[9px] uppercase"
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-8 text-[9px] uppercase"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </IndexPanel>

        <Colophon backHref="/dashboard/admin" backLabel="Back to Command Center" tone="ink">
          <span className="inline-flex items-center gap-1.5">
            <Landmark aria-hidden="true" className="size-4 text-[#C9A25E]" strokeWidth={2} />
            Stripe Ledger synched to MongoDB — certified non-repudiable audit trail
          </span>
        </Colophon>
      </div>
    </div>
  )
}
