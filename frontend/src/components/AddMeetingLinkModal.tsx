import React, { useState } from "react";
import toast from "react-hot-toast";
import { IconX, IconLoader, IconVideo } from "@tabler/icons-react";
import { appointmentService } from "@/services/appointmentService";

interface AddMeetingLinkModalProps {
  appointmentId: number;
  appointmentDetails?: {
    patientName: string;
    doctorName: string;
    appointmentDate: string;
    appointmentTime: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddMeetingLinkModal({
  appointmentId,
  appointmentDetails,
  isOpen,
  onClose,
  onSuccess,
}: AddMeetingLinkModalProps) {
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingPlatform, setMeetingPlatform] = useState("GOOGLE_MEET");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!meetingLink.trim()) {
      toast.error("Please enter a meeting link");
      return;
    }

    if (
      !meetingLink.startsWith("http://") &&
      !meetingLink.startsWith("https://")
    ) {
      toast.error(
        "Meeting link must be a valid URL starting with http:// or https://",
      );
      return;
    }

    try {
      setLoading(true);
      await appointmentService.addMeetingLink(
        appointmentId,
        meetingLink,
        meetingPlatform,
      );
      toast.success("Meeting link added successfully!");
      setMeetingLink("");
      setMeetingPlatform("GOOGLE_MEET");
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to add meeting link";
      toast.error(errorMsg);
      console.error("Error adding meeting link:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <IconVideo size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Add Meeting Link
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <IconX size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Appointment Details */}
          {appointmentDetails && (
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold">Patient:</span>{" "}
                {appointmentDetails.patientName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold">Doctor:</span>{" "}
                {appointmentDetails.doctorName}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Date & Time:</span>{" "}
                {appointmentDetails.appointmentDate} at{" "}
                {appointmentDetails.appointmentTime}
              </p>
            </div>
          )}

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Meeting Platform
            </label>
            <select
              value={meetingPlatform}
              onChange={(e) => setMeetingPlatform(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="GOOGLE_MEET">Google Meet</option>
              <option value="ZOOM">Zoom</option>
              <option value="MICROSOFT_TEAMS">Microsoft Teams</option>
              <option value="JITSI">Jitsi Meet</option>
              <option value="OTHER">Other Platform</option>
            </select>
          </div>

          {/* Meeting Link Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Meeting Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/abc-defg-hij"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Paste the complete meeting link URL
            </p>
          </div>

          {/* Information */}
          <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 p-3 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <span className="font-semibold">ℹ️ Note:</span> The patient will
              receive this meeting link in their appointment details and will be
              able to join the video call at the scheduled time.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <IconLoader size={18} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <IconVideo size={18} />
                  Add Meeting Link
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
