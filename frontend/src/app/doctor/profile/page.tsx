"use client";

import { useEffect, useState } from "react";
import {
  getDoctorProfile,
  updateDoctorProfile,
  DoctorProfile as Doctor,
  UpdateDoctorProfileRequest,
} from "@/services/doctorProfileService";
import {
  IconStethoscope,
  IconMail,
  IconPhone,
  IconId,
  IconCash,
  IconClock,
  IconTextCaption,
  IconEdit,
  IconCheck,
  IconX,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

export default function DoctorProfile() {
  const [profile, setProfile] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateDoctorProfileRequest>>(
    {}
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getDoctorProfile();
        setProfile(response);
        setFormData(response);
      } catch (err: any) {
        toast.error(err.message || "Failed to load profile");
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
      const response = await updateDoctorProfile(
        formData as UpdateDoctorProfileRequest
      );
      setProfile(response);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20 shadow-inner">
            <IconStethoscope size={48} />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              {profile.name}
            </h1>
            <div className="flex items-center gap-2 text-primary font-bold">
              <span className="badge badge-primary badge-outline font-black uppercase tracking-widest px-4">
                {profile.specialization}
              </span>
            </div>
          </div>
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="btn btn-primary btn-wide shadow-lg gap-2"
          >
            <IconEdit size={20} /> Edit Professional Profile
          </button>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left: Professional Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-200 border border-base-content/70 h-full">
            <div className="card-body gap-6">
              <h2 className="text-xl font-black flex items-center gap-2 border-b border-base-200 pb-4">
                <IconId className="text-primary" /> Core Credentials
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase font-black opacity-40">
                    License Number
                  </legend>
                  <div className="flex items-center gap-3">
                    <IconId size={18} className="opacity-30" />
                    <input
                      className={`input w-full font-bold ${
                        editing ? "input-primary" : "input-ghost"
                      }`}
                      disabled={!editing}
                      value={profile.licenseNumber}
                      name="licenseNumber"
                      onChange={handleChange}
                    />
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase font-black opacity-40">
                    Consultation Fee
                  </legend>
                  <div className="flex items-center gap-3">
                    <IconCash size={18} className="opacity-30" />
                    <input
                      name="consultationFee"
                      type="number"
                      disabled={!editing}
                      className={`input w-full font-bold ${
                        editing ? "input-primary" : "input-ghost"
                      }`}
                      value={formData.consultationFee || ""}
                      onChange={handleChange}
                    />
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase font-black opacity-40">
                    Email Address
                  </legend>
                  <div className="flex items-center gap-3">
                    <IconMail size={18} className="opacity-30" />
                    <input
                      name="email"
                      disabled={!editing}
                      className={`input w-full font-bold ${
                        editing ? "input-primary" : "input-ghost"
                      }`}
                      value={formData.email || ""}
                      onChange={handleChange}
                    />
                  </div>
                </fieldset>

                <fieldset className="fieldset">
                  <legend className="fieldset-legend uppercase font-black opacity-40">
                    Phone Number
                  </legend>
                  <div className="flex items-center gap-3">
                    <IconPhone size={18} className="opacity-30" />
                    <input
                      name="phone"
                      disabled={!editing}
                      className={`input w-full font-bold ${
                        editing ? "input-primary" : "input-ghost"
                      }`}
                      value={formData.phone || ""}
                      onChange={handleChange}
                    />
                  </div>
                </fieldset>
              </div>

              <fieldset className="fieldset">
                <legend className="fieldset-legend uppercase font-black opacity-40">
                  Availability (Daily Schedule)
                </legend>
                <div className="flex items-center gap-3">
                  <IconClock size={18} className="opacity-30" />
                  <input
                    name="availableSlots"
                    disabled={!editing}
                    placeholder="e.g. 09:00-17:00"
                    className={`input w-full font-bold ${
                      editing ? "input-primary" : "input-ghost"
                    }`}
                    value={formData.availableSlots || ""}
                    onChange={handleChange}
                  />
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        {/* Right: Bio & Actions */}
        <div className="space-y-6">
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body">
              <h2 className="text-xl font-black flex items-center gap-2 mb-4">
                <IconTextCaption className="text-primary" /> Professional Bio
              </h2>
              <textarea
                name="bio"
                disabled={!editing}
                rows={8}
                className={`textarea w-full font-medium leading-relaxed ${
                  editing
                    ? "textarea-primary bg-base-100"
                    : "textarea-ghost bg-transparent"
                }`}
                placeholder="Share your expertise and background..."
                value={formData.bio || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {editing && (
            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="btn btn-primary shadow-lg gap-2"
              >
                {isSaving ? (
                  <span className="loading loading-spinner" />
                ) : (
                  <IconDeviceFloppy size={20} />
                )}
                Save Profile Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setFormData(profile);
                }}
                className="btn btn-neutral gap-2"
              >
                <IconX size={20} /> Discard Changes
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
