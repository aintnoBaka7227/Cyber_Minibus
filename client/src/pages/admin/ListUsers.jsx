import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import { useAppContext } from "../../context/AppContext";

const ListUsers = () => {
  const { axios, getToken } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const { data } = await axios.get("/api/admin/all-users", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        });
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };

    getAllUsers();
  }, [axios, getToken]);

  return !loading ? (
    <>
      <Title text1="List" text2="Users" />
      <div className="max-w-6xl mt-6 overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#ABD5EA]/20 backdrop-blur-sm text-left text-white">
              <th className="p-4 font-medium pl-6">User Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <td className="p-4 pl-6 text-white">{user.name || 'N/A'}</td>
                  <td className="p-4 text-white">{user.email || 'N/A'}</td>
                  <td className="p-4 text-white">{user.phone || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-8 text-center text-white/70">
                  No users found. Users will appear here once they register.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <div className="flex justify-center items-center h-40">
      <div className="text-white">Loading users...</div>
    </div>
  );
};

export default ListUsers;
