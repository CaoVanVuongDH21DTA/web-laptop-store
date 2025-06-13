import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../../store/features/user";
import { toast } from "react-hot-toast";
import {updateUserDetails} from "../../../api/userInfo" 

const EditProfile = ({ onClose }) => {
  const userInfo = useSelector(selectUserInfo);

  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    phoneNumber: userInfo?.phoneNumber || "",
    avatarUrl: userInfo?.avatar || "", // nếu có URL ảnh sẵn
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userInfo?.avatar || "");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "avatarUrl") {
      setAvatarPreview(value); // preview theo URL
      setAvatarFile(null); // xóa file nếu user nhập URL mới
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        avatarUrl: "", // xóa URL nếu user chọn file
      }));
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("phoneNumber", formData.phoneNumber);

    if (avatarFile) {
      data.append("avatar", avatarFile);
    } else if (formData.avatarUrl) {
      data.append("avatarUrl", formData.avatarUrl);
    }

    try {
      await updateUserDetails(data);
      toast.success("Cập nhật thông tin thành công!");
      onClose(true);
    } catch (error) {
      toast.error("Cập nhật thất bại!");
    }
    onClose(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa thông tin cá nhân</h2>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div className="flex flex-col items-center">
            <img
              src={avatarPreview || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid&w=740"}
              alt="Avatar Preview"
              className="w-36 h-36 rounded-full object-cover mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm mb-2"
            />
            <input
              type="text"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleChange}
              placeholder="hoặc dán URL ảnh tại đây"
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 border rounded text-gray-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditProfile;
