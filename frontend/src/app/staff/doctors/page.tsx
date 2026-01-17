"use client";

import { useState } from "react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  phone: string;
  licenseNumber: string;
  status: "active" | "inactive";
}

export default function ManageDoctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      specialization: "Cardiology",
      phone: "9876543210",
      licenseNumber: "MCI/2015/45678",
      status: "active",
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialization: "Orthopedics",
      phone: "9876543211",
      licenseNumber: "MCI/2018/45679",
      status: "active",
    },
    {
      id: 3,
      name: "Dr. Amit Singh",
      specialization: "Neurology",
      phone: "9876543212",
      licenseNumber: "MCI/2010/45680",
      status: "inactive",
    },
  ];

  const filteredDoctors = doctors
    .filter((doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (doctor) => filterStatus === "all" || doctor.status === filterStatus
    );

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-base-content">
              Manage Doctors
            </h1>
            <p className="text-base-content/70 mt-2">
              View and manage all doctors in the hospital system
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add New Doctor
          </button>
        </div>

        {/* Search & Filter */}
        <div className="card bg-base-200 shadow mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Search Doctor
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="input input-bordered"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter by Status */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="btn btn-outline w-full">Export List</button>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="card bg-base-200 shadow">
              <div className="card-body">
                <h2 className="card-title text-lg">{doctor.name}</h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-semibold">Specialization:</span>{" "}
                    {doctor.specialization}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {doctor.phone}
                  </p>
                  <p>
                    <span className="font-semibold">License:</span>{" "}
                    {doctor.licenseNumber}
                  </p>
                  <p className="pt-2">
                    <span
                      className={`badge ${
                        doctor.status === "active"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {doctor.status.toUpperCase()}
                    </span>
                  </p>
                </div>
                <div className="card-actions justify-between mt-4">
                  <button className="btn btn-sm btn-ghost">Edit</button>
                  <button className="btn btn-sm btn-error btn-outline">
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-base-content/70">No doctors found</p>
          </div>
        )}

        {/* Add Doctor Modal */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box w-full max-w-lg">
              <h3 className="font-bold text-lg">Add New Doctor</h3>
              <form className="py-4 space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="Specialization"
                  className="input input-bordered w-full"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="input input-bordered w-full"
                />
                <input
                  type="text"
                  placeholder="License Number"
                  className="input input-bordered w-full"
                />
              </form>
              <div className="modal-action">
                <button className="btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Add Doctor
                </button>
              </div>
            </div>
            <div
              className="modal-backdrop"
              onClick={() => setShowModal(false)}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
