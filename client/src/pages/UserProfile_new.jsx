import { useEffect, useState } from "react";
import { Camera, Edit, Save, Eye, EyeOff } from "lucide-react";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import { users as mockUsers } from "../assets/dummy";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const getUserProfile = async () => {
    try {
      // Using mock data for development - replace with real API call later
      // Simulating the first user (Alice) as the logged-in user
      const mockUser = mockUsers.find(user => user.role === "client");
      setUserInfo(mockUser);
      setIsLoading(false);
      
      // Real API call (commented out for now)
      /*
      const { axios, getToken } = useAppContext();
      const { data } = await axios.get("/api/user/profile", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setUserInfo(data.user);
      }
      */
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Simulate user being logged in for development
    getUserProfile();
    
    // Real implementation (commented out for now)
    /*
    const { user } = useAppContext();
    if (user) {
      getUserProfile();
    }
    */
  }, []);

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    // For now, just toggle edit mode - implement real save later
    setIsEditing(false);
    console.log("Profile saved:", userInfo);
    console.log("Password data:", passwords);
    
    // Real save implementation (commented out for now)
    /*
    const { axios, getToken } = useAppContext();
    const { data } = await axios.put("/api/user/profile", userInfo, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    });
    */
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-30 md:pt-40 min-h-[80vh]">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      
      <h1 className="text-2xl font-semibold mb-8 text-white">My Profile</h1>

      {/* Profile Card */}
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-lg max-w-4xl">
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-4 border-gray-600">
              <img
                src={avatarPreview || userInfo?.avatar || "/api/placeholder/128/128"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <label className="absolute bottom-2 right-2 bg-[#ABD5EA] hover:bg-[#9BC5DA] p-2 rounded-full cursor-pointer transition-colors">
                <Camera className="w-4 h-4 text-gray-800" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <h2 className="text-xl font-semibold text-white mt-4">
            {userInfo?.firstName} {userInfo?.lastName}
          </h2>
          <p className="text-gray-400">{userInfo?.email}</p>
        </div>

        {/* Profile Form */}
        <div className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userInfo?.firstName || ""}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#ABD5EA] transition-colors"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  {userInfo?.firstName || "Not provided"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={userInfo?.lastName || ""}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#ABD5EA] transition-colors"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                  {userInfo?.lastName || "Not provided"}
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={userInfo?.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#ABD5EA] transition-colors"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                {userInfo?.email || "Not provided"}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            {isEditing ? (
              <div className="flex">
                <span className="inline-flex items-center px-3 text-gray-300 bg-gray-600 border border-r-0 border-gray-600 rounded-l-lg">
                  +61
                </span>
                <input
                  type="tel"
                  value={userInfo?.phone?.replace("+61", "") || ""}
                  onChange={(e) => handleInputChange("phone", "+61" + e.target.value)}
                  placeholder="123 456 789"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-r-lg text-white focus:outline-none focus:border-[#ABD5EA] transition-colors"
                />
              </div>
            ) : (
              <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                {userInfo?.phone || "Not provided"}
              </div>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address
            </label>
            {isEditing ? (
              <textarea
                value={userInfo?.address || ""}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows="3"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#ABD5EA] transition-colors resize-none"
                placeholder="Enter your address"
              />
            ) : (
              <div className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white min-h-[80px]">
                {userInfo?.address || "Not provided"}
              </div>
            )}
          </div>

          {/* Password Section (only when editing) */}
          {isEditing && (
            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwords.currentPassword}
                      onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#ABD5EA] transition-colors pr-12"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwords.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#ABD5EA] transition-colors"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwords.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#ABD5EA] transition-colors"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-600">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-[#ABD5EA] hover:bg-[#9BC5DA] text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-[#ABD5EA] hover:bg-[#9BC5DA] text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default UserProfile;
