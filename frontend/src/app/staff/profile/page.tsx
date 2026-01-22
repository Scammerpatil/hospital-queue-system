"use client";

import { useEffect, useState } from "react";
import {
  getStaffProfile,
  updateStaffProfile,
  StaffProfile as Staff,
  UpdateStaffProfileRequest,
} from "@/services/staffProfileService";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconHierarchy,
  IconBriefcase,
  IconNotes,
  IconEdit,
  IconDeviceFloppy,
  IconX,
  IconBuildingHospital,
  IconMapPin,
  IconShieldCheck,
} from "@tabler/icons-react";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

export default function StaffProfile() {
  const [profile, setProfile] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateStaffProfileRequest>>(
    {},
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getStaffProfile();
        setProfile(response);
        setFormData(response);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const response = await updateStaffProfile(
        formData as UpdateStaffProfileRequest,
      );
      setProfile(response);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-base-content uppercase">
            Staff <span className="text-primary">Profile</span>
          </h1>
          <p className="text-base-content/60 font-bold mt-1 text-xs tracking-widest uppercase">
            System Identity & Clinic Association
          </p>
        </div>
        <button
          onClick={() => {
            if (editing) setFormData(profile || {});
            setEditing(!editing);
          }}
          className={`btn ${editing ? "btn-outline btn-neutral" : "btn-neutral"} btn-wide gap-2 shadow-sm font-black uppercase text-xs`}
        >
          {editing ? (
            <>
              <IconX size={18} stroke={3} /> Cancel
            </>
          ) : (
            <>
              <IconEdit size={18} stroke={3} /> Edit Profile
            </>
          )}
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Sidebar: Identity Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card bg-base-200 border border-base-300 overflow-hidden">
            <div className="h-24 bg-primary/10 border-b border-base-300 flex items-center justify-center">
              <div className="bg-base-100 p-4 rounded-2xl border-2 border-primary shadow-sm -mb-16">
                <IconUser size={48} className="text-primary" />
              </div>
            </div>
            <div className="card-body pt-12 items-center text-center">
              <h2 className="text-xl font-black mt-2">{profile?.name}</h2>
              <div
                className={`badge ${profile?.isActive ? "badge-success" : "badge-error"} font-black text-[10px] uppercase py-3 px-4 border-none`}
              >
                {profile?.isActive ? "Active Account" : "Inactive"}
              </div>
              <div className="divider opacity-10"></div>
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold opacity-70">
                  <IconMail size={18} className="text-primary" />
                  {profile?.email}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold opacity-70">
                  <IconPhone size={18} className="text-primary" />
                  {profile?.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Clinic Association Card */}
          <div className="card bg-neutral text-neutral-content border border-neutral shadow-xl">
            <div className="card-body p-6">
              <div className="flex items-center gap-2 mb-4">
                <IconBuildingHospital size={20} className="text-primary" />
                <h3 className="font-black uppercase tracking-tighter text-sm">
                  Associated Clinic
                </h3>
              </div>
              <p className="text-lg font-black leading-tight mb-2">
                City Care General Hospital
              </p>
              <div className="flex items-start gap-2 text-xs font-bold opacity-60">
                <IconMapPin size={14} className="shrink-0" />
                <span>District: Mumbai, State: Maharashtra</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Detailed Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card bg-base-200 border border-base-300">
            <div className="card-body p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Department */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-black uppercase text-[10px] tracking-widest opacity-50">
                      Department
                    </span>
                  </label>
                  <div className="relative">
                    <IconHierarchy
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                      size={18}
                    />
                    <input
                      name="department"
                      disabled={!editing}
                      value={formData.department || ""}
                      onChange={handleChange}
                      className="input input-bordered w-full pl-12 font-bold focus:border-primary disabled:bg-base-100 disabled:opacity-100"
                    />
                  </div>
                </div>

                {/* Position */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-black uppercase text-[10px] tracking-widest opacity-50">
                      Role / Position
                    </span>
                  </label>
                  <div className="relative">
                    <IconBriefcase
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                      size={18}
                    />
                    <input
                      name="position"
                      disabled={!editing}
                      value={formData.position || ""}
                      onChange={handleChange}
                      className="input input-bordered w-full pl-12 font-bold focus:border-primary disabled:bg-base-100 disabled:opacity-100"
                    />
                  </div>
                </div>

                {/* Email (Editable based on backend policy) */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-black uppercase text-[10px] tracking-widest opacity-50">
                      Work Email
                    </span>
                  </label>
                  <div className="relative">
                    <IconMail
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      disabled={!editing}
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="input input-bordered w-full pl-12 font-bold focus:border-primary disabled:bg-base-100 disabled:opacity-100"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-black uppercase text-[10px] tracking-widest opacity-50">
                      Contact Phone
                    </span>
                  </label>
                  <div className="relative">
                    <IconPhone
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
                      size={18}
                    />
                    <input
                      name="phone"
                      disabled={!editing}
                      value={formData.phone || ""}
                      onChange={handleChange}
                      className="input input-bordered w-full pl-12 font-bold focus:border-primary disabled:bg-base-100 disabled:opacity-100"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="form-control w-full md:col-span-2">
                  <label className="label">
                    <span className="label-text font-black uppercase text-[10px] tracking-widest opacity-50">
                      Professional Bio / Notes
                    </span>
                  </label>
                  <div className="relative">
                    <IconNotes
                      className="absolute left-4 top-4 opacity-30"
                      size={18}
                    />
                    <textarea
                      name="notes"
                      disabled={!editing}
                      value={formData.notes || ""}
                      onChange={handleChange}
                      rows={4}
                      className="textarea textarea-bordered w-full pl-12 font-bold focus:border-primary disabled:bg-base-100 disabled:opacity-100"
                    />
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex gap-4 mt-10">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn btn-neutral flex-1 font-black uppercase shadow-lg shadow-neutral/20"
                  >
                    {isSaving ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <IconDeviceFloppy size={20} stroke={3} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Security Banner */}
          <div className="flex items-center gap-4 p-6 rounded-2xl border-2 border-dashed border-base-300 opacity-50">
            <IconShieldCheck size={32} />
            <div>
              <p className="text-xs font-black uppercase tracking-tighter leading-none mb-1">
                Account Security
              </p>
              <p className="text-[10px] font-bold">
                Role-based access is active. Contact your administrator to
                change your Clinic association.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
