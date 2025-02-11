"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/supabase/client";

interface SearchParams {
  from: string;
  to: string;
}

interface Ticket {
  id: number;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  count: number;
  busModel?: string;
}

export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: "",
    to: "",
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("tickets").select("*");
      if (error) throw error;
      setTickets(data || []);
      setFilteredTickets(data || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("An error occurred while fetching tickets.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilteredTickets(
      tickets.filter(
        (t) =>
          (!searchParams.from || t.from === searchParams.from) &&
          (!searchParams.to || t.to === searchParams.to) &&
          t.count > 0
      )
    );
  };

  const handleBuy = async (ticket: Ticket) => {
    const username = prompt("Iltimos, foydalanuvchi ismingizni kiriting:");
    if (!username) return;

    const newTicket = {
      ticketId: ticket.id,
      username,
      from: ticket.from,
      to: ticket.to,
      date: ticket.date,
      time: ticket.time,
      price: ticket.price,
    };

    try {
      const { error } = await supabase.from("userTickets").insert([newTicket]);
      if (error) {
        console.error("Error booking ticket:", error.message || error);
        alert(`Error: ${error.message || "Something went wrong"}`);
      } else {
        alert("Ticket successfully booked!");

        const updatedTickets = tickets.map((t) =>
          t.id === ticket.id ? { ...t, count: t.count - 1 } : t
        );
        setTickets(updatedTickets);

        setFilteredTickets(updatedTickets.filter((t) => t.count > 0));
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  const regions = [
    "Sirdaryo",
    "Navoiy",
    "Jizzax",
    "Xorazm",
    "Buxoro",
    "Surxondaryo",
    "Namangan",
    "Andijon",
    "Qashqadaryo",
    "Samarqand",
    "Fargʻona",
    "Toshkent",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-6 flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Ticket Booking</h1>
        <Link
          href="/admin"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Admin Panel
        </Link>
      </div>
      <div className="w-full max-w-3xl bg-white shadow-lg p-6 mt-6 rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-blue-700 mb-4">
          Find Your Ticket
        </h2>
        <div className="flex gap-4 mb-6">
          {["from", "to"].map((field) => (
            <select
              key={field}
              className="w-1/2 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setSearchParams({ ...searchParams, [field]: e.target.value })
              }
              value={searchParams[field as keyof SearchParams]}
            >
              <option value="">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          ))}
        </div>
        <button
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-300"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
