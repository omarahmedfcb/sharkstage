import { apiFetch } from "./client";

export async function fetchSentOffers() {
  const data = await apiFetch("/offers/sent");
  return data.offers ?? [];
}

export async function fetchReceivedOffers() {
  const data = await apiFetch("/offers/received");
  return data.offers ?? [];
}

export async function acceptOffer(offerId) {
  const data = await apiFetch(`/offers/accept/${offerId}`, {
    method: "PATCH",
  });
  return data;
}

export async function rejectOffer(offerId) {
  const data = await apiFetch(`/offers/reject/${offerId}`, {
    method: "PATCH",
  });
  return data;
}

export async function cancelOffer(offerId) {
  const data = await apiFetch(`/offers/cancel/${offerId}`, {
    method: "PATCH",
  });
  return data;
}

