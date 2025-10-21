import { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import { adminApi } from "../../api";
import toast from "react-hot-toast";

const ListUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalUsers: 0
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const getAllUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter })
      };

      const data = await adminApi.getAllUsers(params);
      
      if (data.success) {
        // Backend returns data.data.users, not data.users
        setUsers(data.data?.users || []);
        setPagination({
          page: data.data?.pagination?.page || 1,
          limit: data.data?.pagination?.limit || 10,
          totalPages: data.data?.pagination?.totalPages || 1,
          totalUsers: data.data?.pagination?.total || 0
        });
      } else {
        toast.error("Failed to load users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handlePageChange = (newPage) => {
    getAllUsers(newPage);
  };

  return !loading ? (
    <>
      <Title text1="List" text2="Users" />
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 mt-6">
        <input
          type="text"
          placeholder="Search by name, email..."
          value={search}
          onChange={handleSearchChange}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50"
        />
        <select
          value={roleFilter}
          onChange={handleRoleFilterChange}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white [&>option]:bg-gray-800 [&>option]:text-white"
        >
          <option value="" className="bg-white text-black">All Roles</option>
          <option value="client" className="bg-white text-black">Client</option>
          <option value="admin" className="bg-white text-black">Admin</option>
        </select>
      </div>

      <div className="max-w-6xl overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden text-nowrap">
          <thead>
            <tr className="bg-[#ABD5EA]/20 backdrop-blur-sm text-left text-white">
              <th className="p-4 font-medium pl-6">Username</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {users && users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <td className="p-4 pl-6 text-white">{user.username || 'N/A'}</td>
                  <td className="p-4 text-white">{user.email || 'N/A'}</td>
                  <td className="p-4 text-white">{user.phone || 'N/A'}</td>
                  <td className="p-4 text-white">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-white">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-white/70">
                  No users found. Users will appear here once they register.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-primary/20 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/30"
          >
            Previous
          </button>
          <span className="text-white">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-primary/20 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/30"
          >
            Next
          </button>
        </div>
      )}
    </>
  ) : (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default ListUsers;
