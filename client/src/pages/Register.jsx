import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Register = () => {
  const { register } = useAppContext();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = await register({ email, username, password });
    setLoading(false);
    if (user && user.role == "admin") {
      navigate("/admin");
    } 
    else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur">
        <h1 className="text-2xl font-bold text-white mb-6">Register</h1>
        <label className="block text-white/80 text-sm mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-white/20 text-white placeholder-white/60 outline-none"
          placeholder="devuser"
          required
        />
        <label className="block text-white/80 text-sm mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-white/20 text-white placeholder-white/60 outline-none"
          placeholder="dev@example.com"
          required
        />
        <label className="block text-white/80 text-sm mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 rounded bg-white/20 text-white placeholder-white/60 outline-none"
          placeholder="••••••••"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-[#ABD5EA] text-black font-medium rounded hover:bg-[#ABD5EA]/90 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;

