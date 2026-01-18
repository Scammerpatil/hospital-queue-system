"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { IconSearch, IconAlertCircle } from "@tabler/icons-react";
import LocationSelector from "@/components/LocationSelector";
import ClinicCard from "@/components/ClinicCard";
import Loading from "@/components/Loading";
import { doctorService } from "@/services/doctorService";

interface Clinic {
  clinicName: string;
  district: string;
  taluka: string;
  doctors: Array<{ id: number; name: string; specialization: string }>;
  specializations: string[];
  totalDoctors: number;
}

export default function ClinicDiscovery() {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedTaluka, setSelectedTaluka] = useState<string>("");

  // Load all clinics on mount
  useEffect(() => {
    const loadClinics = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getClinics();
        setClinics(data || []);
        setFilteredClinics(data || []);
      } catch (error: any) {
        console.error("Error loading clinics:", error);
        toast.error("Failed to load clinics");
      } finally {
        setLoading(false);
      }
    };

    loadClinics();
  }, []);

  // Filter clinics based on selected location
  useEffect(() => {
    if (!selectedDistrict) {
      setFilteredClinics(clinics);
      return;
    }

    let filtered = clinics.filter(
      (clinic) => clinic.district === selectedDistrict
    );

    if (selectedTaluka) {
      filtered = filtered.filter((clinic) => clinic.taluka === selectedTaluka);
    }

    setFilteredClinics(filtered);
  }, [selectedDistrict, selectedTaluka, clinics]);

  const handleLocationChange = (district: string, taluka?: string) => {
    setSelectedDistrict(district);
    setSelectedTaluka(taluka || "");
  };

  const handleClinicSelect = (clinicName: string) => {
    console.log("Selected clinic:", clinicName);
    // TODO: Navigate to clinic details or booking page
    toast.success(`Selected clinic: ${clinicName}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Clinic
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover clinics in your area and book appointments with qualified doctors
          </p>
        </div>

        {/* Location Selector */}
        <LocationSelector onLocationChange={handleLocationChange} />

        {/* Results Section */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <IconSearch size={20} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedDistrict
                ? `Clinics in ${selectedDistrict}${selectedTaluka ? ` - ${selectedTaluka}` : ""}`
                : "All Clinics"}
            </h2>
            <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full font-semibold">
              {filteredClinics.length}
            </span>
          </div>

          {/* Clinics Grid */}
          {filteredClinics.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClinics.map((clinic) => (
                <ClinicCard
                  key={clinic.clinicName}
                  clinicName={clinic.clinicName}
                  district={clinic.district}
                  taluka={clinic.taluka}
                  doctors={clinic.doctors}
                  specializations={clinic.specializations}
                  totalDoctors={clinic.totalDoctors}
                  onSelectClinic={() => handleClinicSelect(clinic.clinicName)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 border border-gray-200 dark:border-gray-700 text-center">
              <IconAlertCircle
                size={48}
                className="mx-auto text-gray-400 dark:text-gray-600 mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Clinics Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedDistrict
                  ? "No clinics found in the selected location. Try a different district or taluka."
                  : "No clinics are currently available."}
              </p>
              {(selectedDistrict || selectedTaluka) && (
                <button
                  onClick={() => {
                    setSelectedDistrict("");
                    setSelectedTaluka("");
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {clinics.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {clinics.length}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Total Clinics
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {clinics.reduce((sum, clinic) => sum + clinic.totalDoctors, 0)}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Doctors
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {new Set(clinics.flatMap((c) => c.specializations)).size}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Specializations
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
