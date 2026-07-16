import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useSearchParams } from "react-router-dom";
import { resetPasswordSchema } from "../validation/resetPasswordSchema";
import { resetPassword } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import AuthCard from "../components/AuthCard";
import AuthHeader from "../components/AuthHeader";
import PasswordInput from "../components/PasswordInput";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { loading, error, clearError, loginStart, loginFailure } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    clearError();
    loginStart();

    try {
      await resetPassword({ token, password: data.password });
      setSubmitted(true);
    } catch (err) {
      loginFailure(err?.message || "Unable to reset password.");
    }
  };

  if (submitted) {
    return (
      <AuthCard>
        <AuthHeader
          title="Password updated"
          subtitle="Your password has been reset successfully. You can now sign in with your new password."
        />
        <Link
          to="/login"
          className="block w-full text-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
        >
          Sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Reset password"
        subtitle="Choose a strong password for your account."
      />

      {!token && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Reset link is invalid or expired. Request a new link from the forgot
          password page.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <PasswordInput
          id="password"
          label="New password"
          error={errors.password?.message}
          registration={register("password")}
          placeholder="Enter new password"
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm password"
          error={errors.confirmPassword?.message}
          registration={register("confirmPassword")}
          placeholder="Confirm new password"
        />

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Updating..." : "Update password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link to="/login" className="font-medium text-blue-700 hover:text-blue-800">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
};

export default ResetPassword;
