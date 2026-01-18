import React, { useState, useEffect } from "react";
import { IconMapPin, IconLoader } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { doctorService } from "@/services/doctorService";

interface LocationSelectorProps {
  onLocationChange?: (district: string, taluka?: string) => void;
  onDistrictChange?: (district: string) => void;
  onTalukaChange?: (taluka: string) => void;
}

export default function LocationSelector({
  onLocationChange,
  onDistrictChange,
  onTalukaChange,
}: LocationSelectorProps) {
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [talukas, setTalukas] = useState<string[]>([]);
  const [selectedTaluka, setSelectedTaluka] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch districts on component mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getDistricts();
        setDistricts(data || []);
      } catch (error: any) {
        console.error("Error fetching districts:", error);
        toast.error("Failed to load districts");
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, []);

  // Fetch talukas when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const fetchTalukas = async () => {
        try {
          const data = await doctorService.getTalukasByDistrict(selectedDistrict);
          setTalukas(data || []);
          setSelectedTaluka("");
        } catch (error: any) {
          console.error("Error fetching talukas:", error);
          toast.error("Failed to load talukas");
        }
      };

      fetchTalukas();
      onDistrictChange?.(selectedDistrict);
      onLocationChange?.(selectedDistrict, undefined);
    }
  }, [selectedDistrict, onDistrictChange, onLocationChange]);

  // Notify on taluka change
  useEffect(() => {
    if (selectedTaluka) {
      onTalukaChange?.(selectedTaluka);
      onLocationChange?.(selectedDistrict, selectedTaluka);
    }
  }, [selectedTaluka, selectedDistrict, onTalukaChange, onLocationChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <IconLoader className="animate-spin text-blue-600" size={24} />
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Loading locations...
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <IconMapPin size={24} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Find a Clinic
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* District Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            District
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a district</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {districts.length === 0 && !loading && (
            <p className="text-sm text-red-500 mt-1">No districts available</p>
          )}
        </div>

        {/* Taluka Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Taluka {selectedDistrict && <span className="text-gray-500">(Optional)</span>}
          </label>
          <select
            value={selectedTaluka}
            onChange={(e) => setSelectedTaluka(e.target.value)}
            disabled={!selectedDistrict}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">All talukas in {selectedDistrict || "district"}</option>
            {talukas.map((taluka) => (
              <option key={taluka} value={taluka}>
                {taluka}
              </option>
            ))}
          </select>
          {!selectedDistrict && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select a district first
            </p>
          )}
        </div>
      </div>

      {/* Clear Filters Button */}
      {(selectedDistrict || selectedTaluka) && (
        <div className="mt-4">
          <button
            onClick={() => {
              setSelectedDistrict("");
              setSelectedTaluka("");
              setTalukas([]);
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
