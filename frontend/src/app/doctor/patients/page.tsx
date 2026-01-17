"use client";

import { useState } from "react";

interface PatientRecord {
  id: number;
  name: string;
  age: string;
  phone: string;
  lastVisit: string;
  condition: string;
}

export default function PatientRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const patients: PatientRecord[] = [
    {
      id: 1,
      name: "Raj Kumar",
      age: "45",
      phone: "9876543210",
      lastVisit: "2024-03-15",
      condition: "Type 2 Diabetes",
    },
    {
      id: 2,
      name: "Priya Singh",
      age: "32",
      phone: "9876543211",
      lastVisit: "2024-03-18",
      condition: "Hypertension",
    },
    {
      id: 3,
      name: "Amit Patel",
      age: "58",
      phone: "9876543212",
      lastVisit: "2024-03-10",
      condition: "Cardiac Care",
    },
    {
      id: 4,
      name: "Neha Reddy",
      age: "28",
      phone: "9876543213",
      lastVisit: "2024-03-20",
      condition: "General Checkup",
    },
  ];

  const filteredPatients = patients
    .filter((patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "lastVisit")
        return (
          new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
        );
      return 0;
    });

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content">My Patients</h1>
          <p className="text-base-content/70 mt-2">
            View medical records and consultation history
          </p>
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
                  placeholder="Search by name..."
                  className="input input-bordered"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sort */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Sort By</span>
                </label>
                <select
                  className="select select-bordered"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="lastVisit">Last Visit (Recent)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button className="btn btn-primary w-full">
                  Export Records
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="card bg-base-200 shadow">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="bg-base-300">
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Contact</th>
                  <th>Primary Condition</th>
                  <th>Last Visit</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover">
                      <td className="font-semibold">{patient.name}</td>
                      <td>{patient.age} years</td>
                      <td>{patient.phone}</td>
                      <td>
                        <span className="badge badge-warning">
                          {patient.condition}
                        </span>
                      </td>
                      <td>
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-ghost">
                          View Record
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <p className="text-base-content/70">No patients found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-title">Total Patients</div>
            <div className="stat-value text-primary">{patients.length}</div>
          </div>
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-title">Patients This Month</div>
            <div className="stat-value text-success">12</div>
          </div>
          <div className="stat bg-base-200 rounded-lg shadow">
            <div className="stat-title">Follow-up Due</div>
            <div className="stat-value text-warning">3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
