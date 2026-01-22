"use client";

import { Doctor } from "@/Types";
import { useEffect, useState } from "react";
import {
  IconSearch,
  IconUserPlus,
  IconStethoscope,
  IconId,
  IconPhone,
  IconCircleX,
  IconCloudUpload,
  IconLock,
  IconEyeOff,
  IconEye,
} from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import Loading from "@/components/Loading";
import { useAuth } from "@/context/AuthContext";
import axios, { AxiosResponse } from "axios";

export default function ManageDoctors() {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const handleDeactivate = (name: string) => {
    // Logic for deactivation would go here
    toast.success(`${name} has been deactivated`);
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/spring-server/api/doctor/add-doctor", {
        user: doctor?.user,
        doctor: {
          specialization: doctor?.specialization,
          licenseNumber: doctor?.licenseNumber,
          consultationFee: doctor?.consultationFee,
          bio: doctor?.bio,
          availableSlots: doctor?.availableSlots,
        },
        clinicId: user?.clinicId,
      });
      fetchDoctors();
      toast.success("New doctor profile created successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create doctor profile");
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/spring-server/api/doctor/clinic/${user?.clinicId}`,
      );
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      toast.error("Failed to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = (
    folderName: string,
    imageName: string,
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    if (!image) {
      toast.error("No image selected");
      return;
    }
    if (imageName.trim() === "") {
      toast.error("Image name cannot be empty");
      return;
    }
    if (image) {
      if (image.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }
      const imageResponse = axios.postForm("/api/helper/upload-img", {
        file: image,
        name: imageName,
        folderName: folderName,
      });
      toast.promise(imageResponse, {
        loading: "Uploading Image...",
        success: (data: AxiosResponse) => {
          setDoctor((prev) => ({
            ...prev!,
            user: {
              ...(prev?.user! || {}),
              profileImage: data.data.path,
            },
          }));
          return "Image Uploaded Successfully";
        },
        error: (err: unknown) => `This just happened: ${err}`,
      });
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doc) =>
    doc.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Manage <span className="text-primary">Doctors</span>
          </h1>
          <p className="text-base-content/60 font-medium">
            Administration portal for medical staff oversight
          </p>
        </div>
        <button
          className="btn btn-primary shadow-lg shadow-primary/20 gap-2"
          onClick={() => setShowModal(true)}
        >
          <IconUserPlus size={20} /> Add New Doctor
        </button>
      </div>

      {/* Control Bar */}
      <div className="bg-base-200/50 p-4 rounded-3xl border border-base-300 mb-8 flex flex-col md:flex-row gap-4">
        <div className="input input-primary w-full pl-12 bg-base-100 border-none">
          <IconSearch
            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"
            size={20}
          />
          <input
            type="text"
            placeholder="Search doctors by name..."
            className="grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            className="select select-primary w-full bg-base-100 border-none font-bold"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor, idx) => (
          <div
            key={idx}
            className="card bg-base-200 border border-base-content hover:shadow-xl transition-all group"
          >
            <div className="card-body p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <IconStethoscope size={32} />
                </div>
                <div
                  className={`badge font-black uppercase text-[10px] tracking-widest p-3 ${
                    doctor.isAvailable
                      ? "badge-success text-success-content"
                      : "badge-error"
                  }`}
                >
                  {doctor.isAvailable ? "Active" : "Inactive"}
                </div>
              </div>

              <h2 className="text-xl font-black">{doctor.user.name}</h2>
              <p className="text-primary font-bold text-sm mb-4">
                {doctor.specialization}
              </p>

              <div className="space-y-3 py-4 border-y border-base-200 mb-4">
                <div className="flex items-center gap-3 text-sm font-medium opacity-70">
                  <IconId size={16} className="text-primary" />
                  <span>{doctor.licenseNumber}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium opacity-70">
                  <IconPhone size={16} className="text-primary" />
                  <span>{doctor.user.phone}</span>
                </div>
              </div>

              <div className="card-actions grid grid-cols-2 gap-2">
                <button className="btn btn-neutral btn-sm font-bold">
                  Edit Info
                </button>
                <button
                  onClick={() => handleDeactivate(doctor.user.name)}
                  className="btn btn-error btn-outline btn-sm font-bold"
                >
                  Deactivate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-base-200/30 rounded-3xl border-2 border-dashed border-base-300">
          <IconSearch size={48} className="opacity-20 mb-4" />
          <h3 className="text-xl font-bold opacity-40">
            No doctors match your criteria
          </h3>
        </div>
      )}

      {/* Add Doctor Modal */}
      {showModal && (
        <div className="modal modal-open backdrop-blur-sm">
          <Toaster />
          <div className="modal-box max-w-2xl rounded-4xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Register New Doctor</h3>
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <IconCircleX size={24} />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-black uppercase opacity-40">
                    Full Name
                  </legend>
                  <input
                    type="text"
                    placeholder="Dr. John Doe"
                    value={doctor?.user.name || ""}
                    onChange={(e) => {
                      setDoctor((prev) => ({
                        ...prev!,
                        user: {
                          ...(prev?.user! || {}),
                          name: e.target.value,
                        },
                      }));
                    }}
                    className="input input-primary w-full font-bold"
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-black uppercase opacity-40">
                    Specialization
                  </legend>
                  <input
                    type="text"
                    placeholder="e.g. Neurology"
                    value={doctor?.specialization || ""}
                    onChange={(e) => {
                      setDoctor((prev) => ({
                        ...prev!,
                        specialization: e.target.value,
                      }));
                    }}
                    className="input input-primary w-full font-bold"
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-black uppercase opacity-40">
                    Email Address
                  </legend>
                  <input
                    type="email"
                    placeholder="doctor@hospital.com"
                    value={doctor?.user.email || ""}
                    onChange={(e) => {
                      setDoctor((prev) => ({
                        ...prev!,
                        user: {
                          ...(prev?.user! || {}),
                          email: e.target.value,
                        },
                      }));
                    }}
                    className="input input-primary w-full font-bold"
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-black uppercase opacity-40">
                    Phone
                  </legend>
                  <input
                    type="tel"
                    placeholder="+91 ..."
                    value={doctor?.user.phone || ""}
                    onChange={(e) => {
                      setDoctor((prev) => ({
                        ...prev!,
                        user: {
                          ...(prev?.user! || {}),
                          phone: e.target.value,
                        },
                      }));
                    }}
                    className="input input-primary w-full font-bold"
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-black uppercase opacity-40">
                    Profile Image
                  </legend>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                        uploadImage(
                          "doctor-profiles",
                          doctor?.user.name || "profile-image",
                          e,
                        );
                      }
                    }}
                    className="file-input file-input-primary w-full font-bold join-item"
                    required={doctor?.user.profileImage ? false : true}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-black uppercase opacity-40">
                    Password
                  </legend>
                  <div className="input input-primary w-full font-bold">
                    <IconLock className="opacity-30" size={18} />
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="••••••••"
                      className="grow"
                      value={doctor?.user.password || ""}
                      onChange={(e) =>
                        setDoctor((prev) => ({
                          ...prev!,
                          user: {
                            ...(prev?.user! || {}),
                            password: e.target.value,
                          },
                        }))
                      }
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsPasswordVisible(!isPasswordVisible);
                      }}
                      className="opacity-50 hover:opacity-100"
                    >
                      {isPasswordVisible ? (
                        <IconEyeOff size={16} />
                      ) : (
                        <IconEye size={16} />
                      )}
                    </button>
                  </div>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-black uppercase opacity-40">
                    License Number (MCI/State Board)
                  </legend>
                  <input
                    type="text"
                    placeholder="MCI/..."
                    className="input input-primary w-full font-bold"
                    value={doctor?.licenseNumber || ""}
                    onChange={(e) => {
                      setDoctor((prev) => ({
                        ...prev!,
                        licenseNumber: e.target.value,
                      }));
                    }}
                    required
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend font-black uppercase opacity-40">
                    Consultation Fee (in ₹)
                  </legend>
                  <input
                    type="number"
                    placeholder="500"
                    className="input input-primary w-full font-bold"
                    value={doctor?.consultationFee || ""}
                    onChange={(e) => {
                      setDoctor((prev) => ({
                        ...prev!,
                        consultationFee: Number(e.target.value),
                      }));
                    }}
                    required
                  />
                </fieldset>
              </div>

              <div className="modal-action gap-3">
                <button
                  type="button"
                  className="btn btn-neutral font-bold"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-10 font-black"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
