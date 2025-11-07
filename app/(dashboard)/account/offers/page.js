"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Clock,
  XCircle,
  ArrowRightLeft,
  ShieldCheck,
} from "lucide-react";
import { useOffers } from "@/lib/hooks/useOffers";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const statusStyles = {
  pending: "bg-amber-100 text-amber-700 border border-amber-200",
  accepted: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  rejected: "bg-red-100 text-red-600 border border-red-200",
  cancelled: "bg-gray-100 text-gray-500 border border-gray-200",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium capitalize ${
        statusStyles[status] ?? statusStyles.pending
      }`}
    >
      {status}
    </span>
  );
}

function OfferRow({ offer, role, onAccept, onReject, onCancel }) {
  const counterpart =
    role === "investor"
      ? `${offer.offeredBy?.firstName ?? ""} ${offer.offeredBy?.lastName ?? ""}`.trim()
      : `${offer.offeredTo?.firstName ?? ""} ${offer.offeredTo?.lastName ?? ""}`.trim();

  const projectTitle = offer.project?.title ?? "Untitled project";
  const category =
    typeof offer.project?.category === "string"
      ? offer.project?.category
      : offer.project?.category?.en ?? offer.project?.category?.id ?? "General";

  const createdAt = new Date(offer.createdAt ?? Date.now()).toLocaleString("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="rounded-3xl border border-primary/10 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-heading">{projectTitle}</p>
          <p className="text-xs text-paragraph">Category • {category}</p>
        </div>
        <StatusBadge status={offer.status} />
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-paragraph">Counterparty</p>
          <p className="mt-1 text-sm font-medium text-heading">{counterpart || "N/A"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-paragraph">Offer value</p>
          <p className="mt-1 text-sm font-medium text-heading">
            {currency.format(offer.amount ?? offer.offeredAmount ?? 0)}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-paragraph">Created</p>
          <p className="mt-1 text-sm font-medium text-heading">{createdAt}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-paragraph">Notes</p>
          <p className="mt-1 text-sm text-paragraph">
            {offer.terms || offer.message || "No additional notes provided."}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-end gap-2 text-sm">
        {role === "investor" && offer.status === "pending" && (
          <>
            <button
              onClick={() => onAccept?.(offer._id)}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-primary/90"
            >
              <ShieldCheck size={14} /> Accept
            </button>
            <button
              onClick={() => onReject?.(offer._id)}
              className="inline-flex items-center gap-1 rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-500 transition hover:border-red-300"
            >
              <XCircle size={14} /> Decline
            </button>
          </>
        )}
        {role !== "investor" && offer.status === "pending" && (
          <button
            onClick={() => onCancel?.(offer._id)}
            className="inline-flex items-center gap-1 rounded-full border border-amber-200 px-4 py-1.5 text-xs font-semibold text-amber-600 transition hover:border-amber-300"
          >
            <Clock size={14} /> Cancel offer
          </button>
        )}
      </div>
    </li>
  );
}

export default function OffersPage() {
  const { role, sentOffers, receivedOffers, loading, error, accept, reject, cancel } = useOffers();
  const [activeTab, setActiveTab] = useState(role === "investor" ? "received" : "sent");

  const showReceived = role === "investor" || role === "admin";
  const showSent = role === "owner" || role === "admin";

  const receivedCount = receivedOffers.length;
  const sentCount = sentOffers.length;

  const currentList = useMemo(() => {
    if (activeTab === "received") return receivedOffers;
    return sentOffers;
  }, [activeTab, receivedOffers, sentOffers]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-24 rounded-3xl border border-primary/10 bg-white/70 shadow-sm animate-pulse" />
        <div className="h-[420px] rounded-3xl border border-primary/10 bg-white/70 shadow-sm animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="rounded-3xl border border-primary/10 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-heading md:text-3xl">Offer desk</h1>
            <p className="text-sm text-paragraph">
              Review capital offers and keep negotiations moving with clarity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-paragraph">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-primary">
              <BadgeCheck size={12} /> Sent {sentCount}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-3 py-1 text-secondary">
              <ArrowRightLeft size={12} /> Received {receivedCount}
            </span>
          </div>
        </div>
        {error && (
          <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}. Showing cached records until the connection stabilises.
          </div>
        )}
      </header>

      <section className="rounded-3xl border border-primary/10 bg-white/90 p-4 shadow-sm md:p-6">
        <div className="flex flex-wrap gap-2">
          {showReceived && (
            <button
              onClick={() => setActiveTab("received")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeTab === "received"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              }`}
            >
              Received ({receivedCount})
            </button>
          )}
          {showSent && (
            <button
              onClick={() => setActiveTab("sent")}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                activeTab === "sent"
                  ? "bg-secondary text-white shadow-sm"
                  : "bg-secondary/10 text-secondary hover:bg-secondary/20"
              }`}
            >
              Sent ({sentCount})
            </button>
          )}
        </div>

        <ul className="mt-6 space-y-4">
          {currentList.length ? (
            currentList.map((offer) => (
              <OfferRow
                key={offer._id}
                offer={offer}
                role={activeTab === "received" ? (role === "admin" ? "investor" : role) : role}
                onAccept={accept}
                onReject={reject}
                onCancel={cancel}
              />
            ))
          ) : (
            <li className="rounded-3xl border border-primary/10 bg-primary/5 px-4 py-8 text-center text-sm text-paragraph">
              {activeTab === "received"
                ? "No incoming offers at the moment. Keep your projects optimised to attract investors."
                : "No outbound offers yet. Start conversations with matching investors to unlock funding."}
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}

