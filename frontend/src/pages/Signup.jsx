import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const strengthLabel = (score) => {
  if (score >= 4) return { text: "Strong", color: "bg-green-500", bar: "w-full" };
  if (score === 3) return { text: "Good", color: "bg-lime-500", bar: "w-3/4" };
  if (score === 2) return { text: "Fair", color: "bg-yellow-500", bar: "w-1/2" };
  if (score === 1) return { text: "Weak", color: "bg-orange-500", bar: "w-1/4" };
  return { text: "Very weak", color: "bg-red-500", bar: "w-1/6" };
};

const calcStrength = (pwd) => {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return Math.min(score, 5);
};

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "At least 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await API.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setErrors({ general: err?.response?.data?.detail || "Signup failed. Try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const score = calcStrength(form.password);
  const s = strengthLabel(score);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-12">
      <div className="relative w-full max-w-md">
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mix-blend-multiply blur-2xl opacity-20 animate-pulse [animation-delay:800ms]"></div>

        <form
          onSubmit={handleSubmit}
          className="relative bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 space-y-6"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-500 text-sm mt-1">Join and get started in seconds</p>
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{errors.general}</div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Name
            </label>
            <div className="relative">
              <input
                name="name"
                placeholder="Full name"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 pl-12 bg-gray-50/60 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white ${
                  errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 hover:border-gray-300"
                }`}
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 pl-12 bg-gray-50/60 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white ${
                  errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 hover:border-gray-300"
                }`}
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pl-12 pr-12 bg-gray-50/60 border-2 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white ${
                  errors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500/20" : "border-gray-200 hover:border-gray-300"
                }`}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength meter */}
            <div className="mt-1">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${s.color} ${s.bar} transition-all duration-300`}></div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-gray-500">
                <span>Password strength: {s.text}</span>
                <span>Use letters, numbers, symbols</span>
              </div>
            </div>

            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Creating account...
              </>
            ) : (
              <>
                Sign Up
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
