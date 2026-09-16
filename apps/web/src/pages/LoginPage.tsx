import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../context/AuthContext";
import { loginSchema, type LoginFormData } from "../validators/auth.validator";

export const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);

      navigate("/dashboard", { replace: true });
    } catch {
      // API error handling comes next.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-bold text-gray-900">
          Sign in to StudentOps
        </h1>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            {...register("email")}
            type="email"
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            {...register("password")}
            type="password"
            className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white disabled:opacity-50"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
};
