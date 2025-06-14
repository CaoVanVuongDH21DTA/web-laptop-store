import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/features/common";
import { addAddressAPI } from "../../../api/userInfo";
import { saveAddress } from "../../../store/features/user";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
// import { LoaderPage } from "../../../routes/loader";

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
  hidden: { y: "-50px", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { duration: 0.3 } },
};

const AddAddress = ({ onCancel }) => {
  // const [localLoading, setLocalLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const onSubmit = useCallback(
    (evt) => {
      // setLocalLoading(true);
      evt.preventDefault();
      dispatch(setLoading(true));
      setError("");

      addAddressAPI(values)
        .then((res) => {
          dispatch(saveAddress(res));
          toast.success("Thêm address thành công");
          onCancel?.(true); // success = true
        })
        .catch(() => {
          setError("Thêm địa chỉ thất bại");
        })
        .finally(() => {
          dispatch(setLoading(false));
          // setLocalLoading(false)
        });
    },
    [dispatch, onCancel, values]
  );

  const handleOnChange = useCallback((e) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleClose = () => {
    onCancel?.(false); // success = false
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        variants={backdrop}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {/* {localLoading && <LoaderPage/>} */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative"
          variants={modal}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <button
            onClick={handleClose}
            className="absolute top-2 right-3 text-xl font-bold text-gray-500 hover:text-black"
          >
            ✖
          </button>

          <h2 className="text-xl font-semibold mb-4">Thêm địa chỉ mới</h2>
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              name="name"
              placeholder="Tên người nhận"
              className="w-full border p-2 rounded-md border-gray-400"
              required
              value={values.name}
              onChange={handleOnChange}
            />
            <input
              name="phoneNumber"
              placeholder="Số điện thoại"
              className="w-full border p-2 rounded-md border-gray-400"
              required
              value={values.phoneNumber}
              onChange={handleOnChange}
            />
            <input
              name="street"
              placeholder="Địa chỉ"
              className="w-full border p-2 rounded-md border-gray-400"
              required
              value={values.street}
              onChange={handleOnChange}
            />
            <div className="flex gap-2">
              <input
                name="city"
                placeholder="Thành phố"
                className="w-full border p-2 rounded-md border-gray-400"
                required
                value={values.city}
                onChange={handleOnChange}
              />
              <input
                name="state"
                placeholder="Tỉnh"
                className="w-full border p-2 rounded-md border-gray-400"
                required
                value={values.state}
                onChange={handleOnChange}
              />
            </div>
            <input
              name="zipCode"
              placeholder="Mã bưu điện"
              className="w-full border p-2 rounded-md border-gray-400"
              required
              value={values.zipCode}
              onChange={handleOnChange}
            />

            {error && <p className="text-red-600">{error}</p>}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddAddress;
