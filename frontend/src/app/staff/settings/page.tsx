"use client";

import { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    hospitalName: "Central Hospital",
    email: "admin@centralhospital.com",
    phone: "1234567890",
    address: "123 Medical Street, Healthcare City",
    openingTime: "08:00",
    closingTime: "18:00",
    appointmentDuration: "30",
    maxAppointmentsPerDay: "50",
    enableNotifications: true,
    enableEmailReminders: true,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content">
            System Settings
          </h1>
          <p className="text-base-content/70 mt-2">
            Configure hospital details and system preferences
          </p>
        </div>

        {/* Success Message */}
        {saved && (
          <div className="alert alert-success mb-6">
            <span>Settings saved successfully!</span>
          </div>
        )}

        {/* Hospital Information */}
        <div className="card bg-base-200 shadow mb-6">
          <div className="card-body">
            <h2 className="card-title mb-6">Hospital Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Hospital Name
                  </span>
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  className="input input-bordered"
                  value={settings.hospitalName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="input input-bordered"
                  value={settings.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Phone</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="input input-bordered"
                  value={settings.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  className="input input-bordered"
                  value={settings.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="card bg-base-200 shadow mb-6">
          <div className="card-body">
            <h2 className="card-title mb-6">Operating Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Opening Time</span>
                </label>
                <input
                  type="time"
                  name="openingTime"
                  className="input input-bordered"
                  value={settings.openingTime}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Closing Time</span>
                </label>
                <input
                  type="time"
                  name="closingTime"
                  className="input input-bordered"
                  value={settings.closingTime}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Settings */}
        <div className="card bg-base-200 shadow mb-6">
          <div className="card-body">
            <h2 className="card-title mb-6">Appointment Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Appointment Duration (minutes)
                  </span>
                </label>
                <select
                  name="appointmentDuration"
                  className="select select-bordered"
                  value={settings.appointmentDuration}
                  onChange={handleChange}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Max Appointments per Day
                  </span>
                </label>
                <input
                  type="number"
                  name="maxAppointmentsPerDay"
                  className="input input-bordered"
                  value={settings.maxAppointmentsPerDay}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card bg-base-200 shadow mb-6">
          <div className="card-body">
            <h2 className="card-title mb-6">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Enable Notifications</p>
                  <p className="text-sm text-base-content/70">
                    Send real-time notifications to users
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="enableNotifications"
                  className="toggle toggle-primary"
                  checked={settings.enableNotifications}
                  onChange={handleChange}
                />
              </div>

              <div className="divider my-2"></div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Enable Email Reminders</p>
                  <p className="text-sm text-base-content/70">
                    Send appointment reminders via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="enableEmailReminders"
                  className="toggle toggle-primary"
                  checked={settings.enableEmailReminders}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="card bg-base-200 shadow mb-6 border-2 border-warning">
          <div className="card-body">
            <h2 className="card-title mb-6">Maintenance Mode</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Enable Maintenance Mode</p>
                <p className="text-sm text-base-content/70">
                  Temporarily disable system for maintenance
                </p>
              </div>
              <input
                type="checkbox"
                name="maintenanceMode"
                className="toggle toggle-warning"
                checked={settings.maintenanceMode}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <button className="btn btn-ghost">Reset</button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
