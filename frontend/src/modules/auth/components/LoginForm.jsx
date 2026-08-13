import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../validation/loginSchema";
import { login as loginService } from "../services/authService";
import { useAuth, getRoleDashboardPath } from "../hooks/useAuth";
import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";
import PasswordInput from "./PasswordInput";

const LoginForm = () => {
  const navigate = useNavigate();
  const { 
    loginStart,
     loginSuccess,
     loginFailure, 
     loading, 
     error, 
     clearError } =  useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const onSubmit = async (data) => {
    clearError();
    loginStart();

    try {
      const {accessToken, user} = await loginService(data);
      loginSuccess(
        {accessToken,
           user}
          );

      navigate(getRoleDashboardPath(user.role),
       { replace: true });
    } catch (err) {
      loginFailure(err?.message || "Login failed. Please try again.");
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Sign in to your account"
        subtitle="Enter your credentials to access the School Management System."
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
            <p className="mt-1.5 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <PasswordInput
          id="password"
          label="Password"
          error={errors.password?.message}
          registration={register("password")}
        />

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
          >
            ← Back to Home
          </button>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-700 hover:text-blue-800"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthCard>
  );
};

export default LoginForm;
