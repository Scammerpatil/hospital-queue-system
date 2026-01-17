"use client";

import { useState } from "react";

interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: string;
  registrationDate: string;
  status: "active" | "inactive";
}

export default function ManagePatients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const patients: Patient[] = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh.kumar@email.com",
      phone: "9876543210",
      age: "45",
      registrationDate: "2023-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya.singh@email.com",
      phone: "9876543211",
      age: "32",
      registrationDate: "2023-06-22",
      status: "active",
    },
    {
      id: 3,
      name: "Amit Patel",
      email: "amit.patel@email.com",
      phone: "9876543212",
      age: "58",
      registrationDate: "2022-12-10",
      status: "inactive",
    },
  ];

  const filteredPatients = patients
    .filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (patient) => filterStatus === "all" || patient.status === filterStatus
    );

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-base-content">
              Manage Patients
            </h1>
            <p className="text-base-content/70 mt-2">
              View and manage all registered patients
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add New Patient
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
                    Search Patient
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Search by name or email..."
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
                <button className="btn btn-outline w-full">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="card bg-base-200 shadow">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-300">
                <tr>
                  <th>Patient Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Age</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover">
                      <td className="font-semibold">{patient.name}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phone}</td>
                      <td>{patient.age} years</td>
                      <td>
                        {new Date(
                          patient.registrationDate
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            patient.status === "active"
                              ? "badge-success"
                              : "badge-error"
                          }`}
                        >
                          {patient.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-ghost">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <p className="text-base-content/70">No patients found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-title">Total Patients</div>
            <div className="stat-value text-primary">{patients.length}</div>
          </div>
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-title">Active Patients</div>
            <div className="stat-value text-success">
              {patients.filter((p) => p.status === "active").length}
            </div>
          </div>
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-title">New This Month</div>
            <div className="stat-value text-info">5</div>
          </div>
        </div>

        {/* Add Patient Modal */}
        {showModal && (
          <div className="modal modal-open">
            <div className="modal-box w-full max-w-lg">
              <h3 className="font-bold text-lg">Add New Patient</h3>
              <form className="py-4 space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
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
                  type="number"
                  placeholder="Age"
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
                  Add Patient
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
