import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { VITE_HTTP_URL } from "../Config";


const Dashboard = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth?.token) return;

      try {
        const response = await axios.get(`${VITE_HTTP_URL}/signin`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [auth?.token]);

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl font-bold">
        Welcome, {auth?.user?.name || "User"}!
      </h2>
      <p className="mt-2">Your email: {auth?.user?.email}</p>

      {userData && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-xl font-semibold">Your Data:</h3>
          <pre>{JSON.stringify(userData, null, 2)}</pre>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
