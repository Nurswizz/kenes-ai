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
      alert("Please fill in all fields");
      return;
    }

    if (user.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(user.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (
      !/^[a-zA-Z]+$/.test(user.firstName) ||
      !/^[a-zA-Z]+$/.test(user.lastName)
    ) {
      alert("First and Last names must contain only letters");
      return;
    }

    try {
      const response = (await fetchData("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })) as AuthUser;
      console.log("Signup response:", response);
      if (response?.user) {
        login(response);
        window.location.href = '/dashboard';
        setUser({ firstName: "", lastName: "", email: "", password: "" });
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error: any) {
      console.log("Signup error:", error.message);
      alert(error.message || "An error occurred during signup");
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
            className="border p-2 mb-4"
            value={user.firstName}
            onChange={(e) => setUser({ ...user, firstName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="border p-2 mb-4"
            value={user.lastName}
            onChange={(e) => setUser({ ...user, lastName: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 mb-4"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 mb-4"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button type="submit" className="bg-navbar p-2">
            Signup
          </button>
        </form>
        <a href="/auth/login" className="text-[#8d8de7]">
          Already have an account? Login
        </a>
      </div>
    </div>
  );
};

export default Signup;
