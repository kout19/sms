import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { forgotPasswordSchema } from "../validation/forgotPasswordSchema";
import { forgotPassword } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import AuthCard from "../components/AuthCard";
import AuthHeader from "../components/AuthHeader";

const ForgotPassword = () => {
  const { loading, error, clearError, loginStart, loginFailure } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    clearError();
    loginStart();

    try {
      await forgotPassword(data.email);
      setSubmitted(true);
    } catch (err) {
      loginFailure(err?.message || "Unable to process request.");
    }
  };

  if (submitted) {
    return (
      <AuthCard>
        <AuthHeader
          title="Check your email"
          subtitle="If an account exists for that address, password reset instructions have been sent."
        />
        <Link
          to="/login"
          className="block w-full text-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
        >
          Back to sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Forgot password"
        subtitle="Enter your email and we'll send you reset instructions."
      />

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@school.edu"
            className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
              errors.email ? "border-red-400" : "border-slate-300"
            }`}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Remember your password?{" "}
        <Link to="/login" className="font-medium text-blue-700 hover:text-blue-800">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
};

export default ForgotPassword;
