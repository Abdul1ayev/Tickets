"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

interface Ticket {
  id?: number;
  from: string;
  to: string;
  date: string;
  time: string;
  price: string;
  count: string;
  busModel: string;
}

const Admin: React.FC = () => {
  const [ticket, setTicket] = useState<Ticket>({
    from: "",
    to: "",
    date: "",
    time: "",
    price: "",
    count: "",
    busModel: "",
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);
  const supabase = createClient();
  useEffect(() => {
    setIsClient(true);
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("tickets").select("*");
    if (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Error fetching tickets.");
    } else {
      setTickets(data || []);
    }
    setLoading(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setTicket({ ...ticket, [e.target.name]: e.target.value });
  };

  const handleSaveOrUpdate = async () => {
    if (
      !ticket.from ||
      !ticket.to ||
      !ticket.date ||
      !ticket.time ||
      !ticket.price ||
      !ticket.count ||
      !ticket.busModel
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const newTicket = {
      from: ticket.from,
      to: ticket.to,
      date: ticket.date,
      time: ticket.time,
      price: ticket.price,
      count: ticket.count,
      busModel: ticket.busModel,
    };

    let response;
    if (ticket.id) {
      response = await supabase
        .from("tickets")
        .update(newTicket)
        .eq("id", ticket.id);
    } else {
      response = await supabase.from("tickets").insert([newTicket]);
    }

    if (response.error) {
      console.error("Error saving/updating ticket:", response.error);
      toast.error("Error saving/updating ticket.");
    } else {
      toast.success(
        ticket.id
          ? "Ticket updated successfully!"
          : "Ticket added successfully!"
      );
      setTicket({
        from: "",
        to: "",
        date: "",
        time: "",
        price: "",
        count: "",
        busModel: "",
      });
      fetchTickets();
    }
  };

  const handleEdit = (t: Ticket) => {
    setTicket(t);
  };

  const handleDelete = async (id?: number) => {
    if (!id || !window.confirm("Are you sure you want to delete this ticket?"))
      return;

    const { error } = await supabase.from("tickets").delete().eq("id", id);
    if (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Error deleting ticket.");
    } else {
      toast.success("Ticket deleted successfully!");
      fetchTickets();
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

  const times = [
    "08:00",
    "09:30",
    "11:30",
    "16:00",
    "18:00",
    "20:30",
    "22:00",
    "22:30",
    "23:00",
  ];

  const busModels = [
    "Mercedes-Benz (2013)",
    "Isuzu HC45 (2024)",
    "Isuzu HD50 (2024)",
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="container p-5">
      <Link href="/" className="btn btn-outline-secondary mb-4">
        Back to Home
      </Link>

      <div className="d-flex flex-column flex-lg-row gap-4">
        <div
          className="card shadow-sm p-4 flex-shrink-0"
          style={{ width: "100%", maxWidth: "20rem" }}
        >
          <h4 className="text-xl font-semibold mb-4">Create / Edit Ticket</h4>
          <form>
            <div className="mb-3">
              <label className="form-label">From</label>
              <select
                className="form-select"
                name="from"
                value={ticket.from}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Region
                </option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">To</label>
              <select
                className="form-select"
                name="to"
                value={ticket.to}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Region
                </option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={ticket.date}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Time</label>
              <select
                className="form-select"
                name="time"
                value={ticket.time}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Time
                </option>
                {times.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Price (UZS)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={ticket.price}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Count</label>
              <input
                type="number"
                className="form-control"
                name="count"
                value={ticket.count}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Bus Model</label>
              <select
                className="form-select"
                name="busModel"
                value={ticket.busModel}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Bus Model
                </option>
                {busModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className={ticket.id ? "btn-warning" : "btn-primary"}
              onClick={handleSaveOrUpdate}
            >
              {ticket.id ? "Update Ticket" : "Save Ticket"}
            </button>
          </form>
        </div>
        <div className="w-100">
          <h4 className="text-xl font-semibold mb-4">All Tickets</h4>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Count</th>
                    <th>Bus Model</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets
                    .filter((t) => parseInt(t.count) > 0)
                    .map((t, index) => (
                      <tr key={t.id || index}>
                        <td>{index + 1}</td>
                        <td>{t.from}</td>
                        <td>{t.to}</td>
                        <td>{t.date}</td>
                        <td>{t.time}</td>
                        <td>{t.price} UZS</td>
                        <td>{t.count}</td>
                        <td>{t.busModel}</td>
                        <td className="flex gap-1">
                          <button
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-3 border border-gray-400 rounded shadow"
                            onClick={() => handleEdit(t)}
                          >
                            <FontAwesomeIcon
                              className="mx-auto"
                              icon={faEdit}
                            />
                          </button>
                          <button
                            className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-3 border border-gray-400 rounded shadow"
                            onClick={() => handleDelete(t.id)}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
