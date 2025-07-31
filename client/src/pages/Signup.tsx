import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import useApi from "../hooks/useApi";
import useAuth from "../hooks/useAuth";
interface AuthUser {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}
const Signup = () => {
  const { fetchData } = useApi();
  const { login, isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = "/dashboard";
    }
  }, []);

  const handleSubmit = async () => {
    // валидация
    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      setError("Please fill in all fields");
      return;
    }

    if (user.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(user.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (
      !/^[a-zA-Z]+$/.test(user.firstName) ||
      !/^[a-zA-Z]+$/.test(user.lastName)
    ) {
      setError("First and Last names must contain only letters");
      return;
    }

    try {
      const response = (await fetchData("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })) as AuthUser;

      if (response?.user) {
        login(response);
        window.location.href = '/dashboard';
        setUser({ firstName: "", lastName: "", email: "", password: "" });
      } else {
        setError("Signup failed. Please try again.");
      }
    } catch (error: any) {
      if (error.error.status === 400) {
        setError("User already exists.");
      } else if (error.error.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(error.message || "An error occurred during signup");
      }
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Navbar />
      <div className="text-center bg-white p-6 rounded shadow-md">
        <h1 className="text-4xl font-bold mb-4">Signup</h1>
        <form
          className="w-72 flex flex-col mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            type="text"
            placeholder="First Name"
            className="border p-2 mb-4 rounded-lg"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border p-2 mb-4 rounded-lg"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 mb-4 rounded-lg"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 mb-4 rounded-lg"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button type="submit" className="bg-navbar p-2 rounded-lg">
            Signup
          </button>
        </form>
        {error && <p className="text-[red]">{error}</p>}
        <a href="/auth/login" className="text-[#8d8de7]">
          Already have an account? Login
        </a>
      </div>
    </div>
  );
};

export default Signup;
