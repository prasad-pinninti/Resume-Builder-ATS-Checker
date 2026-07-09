import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import api from "../configs/api";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.post(`/api/users/reset-password/${token}`, { password });
      toast.success(data.message || "Password reset successfully!");
      navigate("/?state=login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-10 bg-white shadow-sm"
      >
        <h1 className="text-gray-900 text-3xl font-medium">
          Reset Password
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Enter your new password below.
        </p>

        <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color="#6B7280" />
          <input
            type="password"
            placeholder="New Password"
            className="border-none outline-none ring-0 w-full text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={13} color="#6B7280" />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border-none outline-none ring-0 w-full text-sm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
