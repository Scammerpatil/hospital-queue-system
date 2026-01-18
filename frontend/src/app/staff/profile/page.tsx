"use client";

import { useEffect, useState } from "react";
import {
  getStaffProfile,
  updateStaffProfile,
  StaffProfile as Staff,
  UpdateStaffProfileRequest,
} from "@/services/staffProfileService";
import { IconAlertCircle } from "@tabler/icons-react";

export default function StaffProfile() {
  const [profile, setProfile] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateStaffProfileRequest>>(
    {}
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getStaffProfile();
        console.log("Staff profile fetched:", response);
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
    try {
      setIsSaving(true);
      const response = await updateStaffProfile(
        formData as UpdateStaffProfileRequest
      );
      setProfile(response);
      setEditing(false);
      setError(null);
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
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
              Staff Profile
            </h1>
            <p className="text-base-content/70 mt-2">
              Manage your staff information
            </p>
          </div>
          <button
            className={`btn ${editing ? "btn-ghost" : "btn-primary"}`}
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-4">
            <IconAlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="card bg-base-200 shadow">
          <form onSubmit={handleSubmit} className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Full Name</span>
                </label>
                <div className="input input-bordered bg-base-100">
                  {profile.name}
                </div>
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

              {/* Department */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Department</span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="department"
                    className="input input-bordered"
                    value={formData.department || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="input input-bordered bg-base-100">
                    {profile.department}
                  </div>
                )}
              </div>

              {/* Position */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Position</span>
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="position"
                    className="input input-bordered"
                    value={formData.position || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="input input-bordered bg-base-100">
                    {profile.position}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <div className="input input-bordered bg-base-100">
                  <span
                    className={`badge ${
                      profile.isActive ? "badge-success" : "badge-error"
                    }`}
                  >
                    {profile.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Notes</span>
                </label>
                {editing ? (
                  <textarea
                    name="notes"
                    className="textarea textarea-bordered"
                    value={formData.notes || ""}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Add any additional notes..."
                  ></textarea>
                ) : (
                  <div className="textarea textarea-bordered bg-base-100">
                    {profile.notes || "No notes added"}
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
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${isSaving ? "loading" : ""}`}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
