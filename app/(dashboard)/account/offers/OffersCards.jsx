import MessageForm from "@/app/(main)/projects/[id]/MessageForm";
import api from "@/lib/axios";
import { getProjects } from "@/lib/features/projects/projectsThunks";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const lang = "en"; // or "ar" based on your setup

const statusColor = (status) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const statusText = (status) => {
  switch (status) {
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "pending":
      return "Pending";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

export default function OffersCards({
  userOffers,
  onView,
  currentUser,
  fetchUserOffers,
}) {
  const [offerAcceptLoading, setOfferAcceptLoading] = useState(false);
  const [offerRejectLoading, setOfferRejectLoading] = useState(false);
  const [offerCancelLoading, setOfferCancelLoading] = useState(false);
  const dispatch = useDispatch();

  const acceptOffer = async (id) => {
    setOfferAcceptLoading(true);
    try {
      await api.patch(`/offers/accept/${id}`);
      toast.success("Offer accepted");
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      }
    } finally {
      fetchUserOffers();
      setOfferAcceptLoading(false);
      dispatch(getProjects());
    }
  };
  const rejectOffer = async (id) => {
    setOfferRejectLoading(true);
    try {
      await api.patch(`/offers/reject/${id}`);
      toast.success("Offer rejected");
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      }
    } finally {
      fetchUserOffers();
      setOfferRejectLoading(false);
    }
  };

  const cancelOffer = async (id) => {
    setOfferCancelLoading(true);
    try {
      await api.patch(`/offers/cancel/${id}`);
      toast.success("Offer cancelled");
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      }
    } finally {
      fetchUserOffers();
      setOfferCancelLoading(false);
    }
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {userOffers.map((offer) => (
        <div
          key={offer._id}
          className="bg-white rounded-xl shadow p-5 flex flex-col justify-between hover:shadow-lg transition"
        >
          {/* Header Section */}
          <div>
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor(
                  offer.status
                )}`}
              >
                {statusText(offer.status)}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(offer.createdAt).toISOString().split("T")[0]}
              </span>
            </div>

            {/* Project Title */}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {offer.project?.title}
            </h3>

            {/* Category */}
            <div className="mb-3">
              <span className="inline-block px-2 py-1 bg-soft text-primary text-xs rounded">
                {offer.project?.category[lang]}
              </span>
            </div>

            {/* Offered To */}
            <div className="mb-3 pb-3 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-1">
                {currentUser?.accountType == "investor"
                  ? "Offered To"
                  : "Offered By"}
              </p>
              <p className="text-sm font-medium text-heading">
                {currentUser?.accountType == "investor"
                  ? `${offer.offeredTo.firstName} ${offer.offeredTo.lastName}`
                  : `${offer.offeredBy.firstName} ${offer.offeredBy.lastName}`}
              </p>
            </div>

            {/* Offer Details */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Percentage:</span>
                <span className="text-sm font-semibold text-primary">
                  {offer.percentage}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="text-sm font-semibold text-heading">
                  ${offer.amount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Proposal Letter Preview */}
            {offer.proposalLetter && (
              <div className="mb-3">
                <p className="text-xs text-gray-700 font-bold mb-1">Proposal</p>
                <p className="text-xs text-gray-700 line-clamp-2">
                  {offer.proposalLetter.slice(0, 32)}
                  {offer.proposalLetter.length > 32 ? "..." : null}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Link
              href={`/account/offers/${offer._id}`}
              className="flex-1 px-3 py-2 bg-primary text-white text-center rounded-lg hover:bg-secondary transition text-sm font-medium"
            >
              View Details
            </Link>

            {offer.status === "pending" &&
              (currentUser?.accountType == "investor" ? (
                <button
                  disabled={offerCancelLoading}
                  onClick={() => cancelOffer(offer._id)}
                  className="flex-1 px-3 py-2 border disabled:opacity-50 disabled:cursor-not-allowed border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm font-medium"
                >
                  {offerCancelLoading && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {offerCancelLoading ? null : "Cancel"}
                </button>
              ) : (
                <>
                  <button
                    disabled={offerAcceptLoading || offerRejectLoading}
                    onClick={() => rejectOffer(offer._id)}
                    className="flex-1 px-3 py-2 border disabled:opacity-50 disabled:cursor-not-allowed bg-red-700 text-white rounded-lg hover:bg-red-50 hover:text-red-700 transition text-sm font-medium"
                  >
                    {offerRejectLoading && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {offerRejectLoading ? null : "Reject"}
                  </button>
                  <button
                    disabled={offerAcceptLoading || offerRejectLoading}
                    onClick={() => acceptOffer(offer._id)}
                    className="disabled:opacity-50 disabled:cursor-not-allowed flex-1 px-3 py-2 border bg-green-700 text-white rounded-lg hover:bg-green-50 hover:text-green-700 transition text-sm font-medium"
                  >
                    {offerAcceptLoading && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {offerAcceptLoading ? null : "Accept"}
                  </button>
                </>
              ))}
          </div>

          {offer.status !== "cancelled" &&
            (currentUser?.accountType == "owner" ? (
              <MessageForm owner={offer.offeredBy} />
            ) : null)}
        </div>
      ))}
    </div>
  );
}
