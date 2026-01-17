export default function MySchedule() {
  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-base-content">
              My Schedule
            </h1>
            <p className="text-base-content/70 mt-2">
              Manage your consultation hours and availability
            </p>
          </div>
          <button className="btn btn-primary">Add Schedule Slot</button>
        </div>

        {/* Weekly Schedule */}
        <div className="card bg-base-200 shadow mb-6">
          <div className="card-body">
            <h2 className="card-title mb-6">Weekly Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday"].map((day) => (
                <div key={day} className="bg-base-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-3">{day}</h3>
                  <div className="space-y-2">
                    <div className="badge badge-primary">
                      09:00 AM - 01:00 PM
                    </div>
                    <div className="badge badge-primary">
                      02:00 PM - 06:00 PM
                    </div>
                  </div>
                  <button className="btn btn-sm btn-ghost mt-3 w-full">
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="card bg-base-200 shadow mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Set as Available</h3>
                <p className="text-sm text-base-content/70">
                  Patients can book appointments when you're available
                </p>
              </div>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                defaultChecked
              />
            </div>
          </div>
        </div>

        {/* Emergency Slots */}
        <div className="card bg-base-200 shadow">
          <div className="card-body">
            <h2 className="card-title mb-6">Emergency/Holiday</h2>
            <div className="space-y-4">
              <div className="bg-base-100 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    Scheduled Holiday - 15th April 2024
                  </p>
                  <p className="text-sm text-base-content/70">
                    No appointments scheduled
                  </p>
                </div>
                <button className="btn btn-sm btn-ghost">Remove</button>
              </div>
            </div>
            <button className="btn btn-outline mt-4 w-full">
              Add Holiday/Leave
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
