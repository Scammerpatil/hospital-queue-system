import React from "react";

interface ClinicCardProps {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  openingTime?: string;
  closingTime?: string;
  onSelect: (id: number) => void;
}

export default function ClinicCard({
  id,
  name,
  city,
  address,
  phone,
  openingTime,
  closingTime,
  onSelect,
}: ClinicCardProps) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="card-body">
        <h2 className="card-title text-lg">{name}</h2>
        <p className="text-sm text-gray-600">{city}</p>
        <p className="text-sm">{address}</p>
        <p className="text-sm">
          <span className="font-semibold">Phone:</span> {phone}
        </p>
        {openingTime && closingTime && (
          <p className="text-sm">
            <span className="font-semibold">Hours:</span> {openingTime} -{" "}
            {closingTime}
          </p>
        )}
        <div className="card-actions justify-end">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onSelect(id)}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
