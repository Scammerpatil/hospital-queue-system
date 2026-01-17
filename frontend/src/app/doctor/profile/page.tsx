"use client";

import { useEffect, useState } from "react";
import { authService } from "@/services/authService";

interface DoctorProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  yearsOfExperience: string;
  qualifications: string;
  bio: string;
  clinicAddress: string;
}

export default function DoctorProfile() {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<DoctorProfile>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await authService.getCurrentUser();
        console.log("Doctor profile fetched:", response);
        setProfile(response);
        setFormData(response);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData as DoctorProfile);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <span>{error || "Profile not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-base-content">
              Doctor Profile
            </h1>
            <p className="text-base-content/70 mt-2">
              Manage your professional information
            </p>
          </div>
          <button
            className={`btn ${editing ? "btn-ghost" : "btn-primary"}`}
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Card */}
        <div className="card bg-base-200 shadow">
          <form onSubmit={handleSubmit} className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    className="input input-bordered"
                    value={formData.name || ""}
                    onChange={handleChange}
                    disabled
                  />
                ) : (
                  <div className="input input-bordered bg-base-100">
                    {profile.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    className="input input-bordered"
                    value={formData.email || ""}
                    onChange={handleChange}
                    disabled
                  />
                ) : (
                  <div className="input input-bordered bg-base-100">
                    {profile.email}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Phone</span>
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    className="input input-bordered"
                    value={formData.phone || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="input input-bordered bg-base-100">
                    {profile.phone}
                  </div>
                )}
              </div>

              {/* Specialization */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Specialization
                  </span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="specialization"
                    className="input input-bordered"
                    value={formData.specialization || ""}
                    onChange={handleChange}
                    disabled
                  />
                ) : (
                  <div className="input input-bordered bg-base-100">
                    {profile.specialization}
                  </div>
                )}
              </div>

              {/* License Number */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    License Number
                  </span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="licenseNumber"
                    className="input input-bordered"
                    value={formData.licenseNumber || ""}
                    onChange={handleChange}
                    disabled
                  />
                ) : (
                  <div className="input input-bordered bg-base-100">
                    {profile.licenseNumber}
                  </div>
                )}
              </div>

              {/* Years of Experience */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Years of Experience
                  </span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="yearsOfExperience"
                    className="input input-bordered"
                    value={formData.yearsOfExperience || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="input input-bordered bg-base-100">
                    {profile.yearsOfExperience}
                  </div>
                )}
              </div>

              {/* Qualifications */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">
                    Qualifications
                  </span>
                </label>
                {editing ? (
                  <textarea
                    name="qualifications"
                    className="textarea textarea-bordered"
                    value={formData.qualifications || ""}
                    onChange={handleChange}
                    rows={2}
                  ></textarea>
                ) : (
                  <div className="textarea textarea-bordered bg-base-100">
                    {profile.qualifications}
                  </div>
                )}
              </div>

              {/* Clinic Address */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">
                    Clinic Address
                  </span>
                </label>
                {editing ? (
                  <textarea
                    name="clinicAddress"
                    className="textarea textarea-bordered"
                    value={formData.clinicAddress || ""}
                    onChange={handleChange}
                    rows={2}
                  ></textarea>
                ) : (
                  <div className="textarea textarea-bordered bg-base-100">
                    {profile.clinicAddress}
                  </div>
                )}
              </div>

              {/* Bio */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">
                    Professional Bio
                  </span>
                </label>
                {editing ? (
                  <textarea
                    name="bio"
                    className="textarea textarea-bordered"
                    value={formData.bio || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell patients about your expertise..."
                  ></textarea>
                ) : (
                  <div className="textarea textarea-bordered bg-base-100">
                    {profile.bio || "No bio added"}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {editing && (
              <div className="card-actions justify-end mt-6">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
