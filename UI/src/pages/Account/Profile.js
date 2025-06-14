import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeAddress, selectUserInfo } from "../../store/features/user";
import { setLoading } from "../../store/features/common";
import { deleteAddressAPI } from "../../api/userInfo";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import EditProfile from "./Profile/EditProfile";
import AddAddress from "./Address/AddAddress";
import EditAddress from "./Address/EditAddress"

const Profile = () => {
  const userInfo = useSelector(selectUserInfo);
  const [addAddressVisible, setAddAddressVisible] = useState(false);
  const dispatch = useDispatch();
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [editAddressVisible, setEditAddressVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const onDeleteAddress = useCallback((id) => {
    dispatch(setLoading(true));
    deleteAddressAPI(id)
      .then(() => {
        dispatch(removeAddress(id));
        toast.success("Xoá địa chỉ thành công");
      })
      .catch((err) => {
        toast.error("Xoá thất bại");
        console.error("Delete failed", err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 pb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* Profile header + Edit */}
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-8 bg-white p-4 rounded-lg shadow">
        <button
          className="absolute top-4 right-4 text-sm text-blue-600 hover:underline"
          onClick={() => setEditProfileVisible(true)}
        >
          Edit
        </button>
        <img 
          alt={userInfo.email}
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover mb-2 sm:mb-0"
          src={userInfo?.avatarUrl || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid&w=740"}
        />
        <div className="text-center sm:text-left">
          <p className="text-lg sm:text-xl font-semibold">{userInfo?.firstName} {userInfo?.lastName}</p>
          <p className="text-gray-600 text-sm sm:text-base">{userInfo?.email}</p>
          <p className="text-gray-600 text-sm sm:text-base">{userInfo?.phoneNumber ?? "None"}</p>
        </div>
      </div>

      {/* Modal Edit Profile */}
      {editProfileVisible && (
        <EditProfile onClose={() => setEditProfileVisible(false)} />
      )}

      {/* Address Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Addresses</h2>
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setAddAddressVisible(true)}
          >
            + Add New Address
          </button>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
          {userInfo?.addressList?.length > 0 ? (
            userInfo.addressList.map((address, index) => (
              <motion.div
                key={index}
                className="bg-white border rounded-lg p-4 shadow hover:shadow-md transition"
                whileHover={{ scale: 1.02 }}
              >
                <p className="font-bold">{address?.name}</p>
                <p>{address?.phoneNumber}</p>
                <p className="text-sm text-gray-700">{`${address?.street}, ${address?.city}, ${address?.state}`}</p>
                <p className="text-sm text-gray-600">{address?.zipCode}</p>
                <div className="flex justify-end gap-4 mt-2 text-sm">
                  <button
                    onClick={() => {
                      setSelectedAddress(address);
                      setEditAddressVisible(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDeleteAddress(address?.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              Bạn chưa thêm địa chỉ, vui lòng thêm địa chỉ cụ thể của bạn.
            </p>
          )}
        </div>
      </div>

      {/* Modal */}
      {addAddressVisible && (
        <AddAddress
          onCancel={(success) => {
            setAddAddressVisible(false);
            if (!success) {
              toast("Bạn chưa thêm address");
            }
          }}
        />
      )}

      {editAddressVisible && selectedAddress && (
        <EditAddress
          address={selectedAddress}
          onCancel={(success) => {
            setEditAddressVisible(false);
            setSelectedAddress(null);
            if (!success) {
              toast("Bạn chưa cập nhật address");
            }
          }}
        />
      )}

    </motion.div>
  );
};

export default Profile;
