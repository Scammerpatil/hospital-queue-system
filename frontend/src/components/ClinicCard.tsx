import React from "react";
import { IconMapPin, IconStethoscope, IconUsers } from "@tabler/icons-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
}

interface ClinicCardProps {
  clinicName: string;
  district: string;
  taluka: string;
  doctors: Doctor[];
  specializations: string[];
  totalDoctors: number;
  onSelectClinic?: () => void;
}

export default function ClinicCard({
  clinicName,
  district,
  taluka,
  doctors,
  specializations,
  totalDoctors,
  onSelectClinic,
}: ClinicCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {clinicName}
        </h3>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 gap-1">
          <IconMapPin size={16} />
          <span>
            {taluka}, {district}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <IconUsers size={20} className="text-blue-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Doctors</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {totalDoctors}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconStethoscope size={20} className="text-green-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Specializations
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {specializations.length}
            </p>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Specializations
        </p>
        <div className="flex flex-wrap gap-2">
          {specializations.slice(0, 3).map((spec, index) => (
            <span
              key={index}
              className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded"
            >
              {spec}
            </span>
          ))}
          {specializations.length > 3 && (
            <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded">
              +{specializations.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Doctor List Preview */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Doctors
        </p>
        <div className="space-y-1">
          {doctors.slice(0, 3).map((doctor) => (
            <div
              key={doctor.id}
              className="text-sm text-gray-600 dark:text-gray-400 flex justify-between"
            >
              <span className="font-medium">{doctor.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">
                {doctor.specialization}
              </span>
            </div>
          ))}
          {doctors.length > 3 && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              +{doctors.length - 3} more doctors
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onSelectClinic}
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        View Clinic & Book
      </button>
    </div>
  );
}
