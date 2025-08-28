import Title from "../../components/admin/Title";

const ListUsers = () => {
  return (
    <div>
      <Title text1={"List"} text2={"Users"} />
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            User management functionality will be implemented here.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            This page will display:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>List of all registered users</li>
              <li>User details and permissions</li>
              <li>User management actions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListUsers;
