"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import OffersCards from "./OffersCards";
const lang = "en";

export default function OffersPage() {
  // const { projects, projectsLoading } = useSelector((state) => state.projects);

  const { currentUser } = useSelector((state) => state.auth);

  const [userOffers, setUserOffers] = useState([]);
  const fetchUserOffers = async () => {
    if (!currentUser) return;
    try {
      if (currentUser.accountType == "investor") {
        const res = await api.get(`/offers/sent`);
        setUserOffers(res.data.offers);
      }
      if (currentUser.accountType == "owner") {
        const res = await api.get(`/offers/received`);
        setUserOffers(res.data.offers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserOffers();
  }, [currentUser]);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 ">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-2 md:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          My Offers
        </h1>
      </header>

      {/* Table */}

      <OffersCards
        userOffers={userOffers}
        currentUser={currentUser}
        fetchUserOffers={fetchUserOffers}
      />
    </div>
  );
}
