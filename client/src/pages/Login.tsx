import { Navbar } from '../components/Navbar';
import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import useAuth from "../hooks/useAuth";
import { Loader2Icon } from 'lucide-react';
interface AuthUser {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}
const Login = () => {
  const { fetchData } = useApi();
  const { login, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      window.location.href = "/dashboard";
    } else {
      localStorage.clear();
    }
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    if (!user.email || !user.password) {
      alert("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (user.password.length < 6) {
      alert("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(user.email)) {
      alert("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = (await fetchData("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      })) as AuthUser;

      if (response?.user) {
        login(response);
        window.location.href = '/dashboard';
        setUser({ email: "", password: "" });
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error: any) {
      if (error.error.status === 404 || error.error.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else {
      setError("An error occurred while logging in.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Navbar />
      <div className='text-center bg-white p-6 rounded shadow-md '>
        <h1 className="text-4xl font-bold mb-4">Login</h1>
        <form action="" className='w-72 flex flex-col mb-4' onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}>
          <input type="email" placeholder="Email" className="border p-2 mb-4 rounded-lg" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
          <input type="password" placeholder="Password" className="border p-2 mb-4 rounded-lg" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
          <button type="submit" className="bg-navbar p-2 rounded-lg flex justify-center items-center">
            {loading ? <Loader2Icon className="animate-spin" /> : "Login"}
          </button>
        </form>
        {error && <p className="text-[red]">{error}</p>}
        <a href="/auth/signup" className="text-[#8d8de7]">Don't have an account? Signup</a>
      </div>
    </div>
  );
};

export default Login;
