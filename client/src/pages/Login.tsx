import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useMemberstack from "../hooks/useMemberstack";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useMemberstack();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");


    try {
      const response = await login(email, password);
      if (response.error) {
        setError(response.error.message || "Registration failed");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-2xl w-96 border-[1px] border-[#959595] text-primary"
      >
        <h2 className="text-3xl font-semibold mb-4">Sign in</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#2762ed] text-white py-2 px-4 rounded hover:bg-[#243f7d] transition duration-200 text-[#ffffff] font-semibold text-xl"
        >
          Sign in
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Do not have an account?{" "}
          <a
            href="/signup"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
