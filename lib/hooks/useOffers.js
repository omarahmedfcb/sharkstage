"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchReceivedOffers,
  fetchSentOffers,
  acceptOffer,
  rejectOffer,
  cancelOffer,
} from "@/lib/api/offers";

const FALLBACK_SENT = [
  {
    _id: "fallback-sent-1",
    project: { title: "AI Diagnostics Platform", category: { en: "AI & Automation" } },
    offeredTo: { firstName: "Layla", lastName: "Ahmad" },
    status: "pending",
    amount: 250000,
    createdAt: new Date().toISOString(),
  },
];

const FALLBACK_RECEIVED = [
  {
    _id: "fallback-rec-1",
    project: { title: "Solar Energy Farms Network", category: { en: "Green Energy" } },
    offeredBy: { firstName: "Omar", lastName: "Khalil" },
    status: "pending",
    amount: 500000,
    createdAt: new Date().toISOString(),
  },
];

export function useOffers({ eager = true } = {}) {
  const { currentUser } = useSelector((state) => state.auth);
  const [sentOffers, setSentOffers] = useState(FALLBACK_SENT);
  const [receivedOffers, setReceivedOffers] = useState(FALLBACK_RECEIVED);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const role = currentUser?.accountType ?? "investor";

  useEffect(() => {
    let cancelled = false;
    if (!eager || !currentUser?._id) return undefined;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        if (role === "owner" || role === "admin") {
          const sent = await fetchSentOffers();
          if (!cancelled && sent.length) {
            setSentOffers(sent);
          }
        }
        if (role === "investor" || role === "admin") {
          const received = await fetchReceivedOffers();
          if (!cancelled && received.length) {
            setReceivedOffers(received);
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError(err.message || "Unable to load offers");
          setSentOffers(FALLBACK_SENT);
          setReceivedOffers(FALLBACK_RECEIVED);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [currentUser?._id, eager, role]);

  const handleAccept = async (offerId) => {
    await acceptOffer(offerId);
    setReceivedOffers((prev) =>
      prev.map((offer) => (offer._id === offerId ? { ...offer, status: "accepted" } : offer))
    );
  };

  const handleReject = async (offerId) => {
    await rejectOffer(offerId);
    setReceivedOffers((prev) =>
      prev.map((offer) => (offer._id === offerId ? { ...offer, status: "rejected" } : offer))
    );
  };

  const handleCancel = async (offerId) => {
    await cancelOffer(offerId);
    setSentOffers((prev) =>
      prev.map((offer) => (offer._id === offerId ? { ...offer, status: "cancelled" } : offer))
    );
  };

  return {
    role,
    sentOffers,
    receivedOffers,
    loading,
    error,
    accept: handleAccept,
    reject: handleReject,
    cancel: handleCancel,
  };
}

