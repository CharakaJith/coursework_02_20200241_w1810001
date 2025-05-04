import axios from 'axios';
import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { USER, VALIDATE } from '@/common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function PasswordPopup({ isOpen, onClose, onSuccess }) {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState([]);
  const [isError, setIsError] = useState(false);

  // handle old password change
  const handleOldPasswordChange = (e) => {
    const oldPassword = e.target.value;
    setOldPassword(oldPassword);

    if (oldPassword.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle confrim password on change
  const handleConfrimPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

    if (newConfirmPassword.trim().length > 0) {
      setIsError(false);
    }
  };

  //   handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // validate form fields
    if (
      !oldPassword ||
      oldPassword.trim().length === 0 ||
      !password ||
      password.trim().length === 0 ||
      !confirmPassword ||
      confirmPassword.trim().length === 0
    ) {
      setError([VALIDATE.EMPTY_FIELDS]);
      setIsError(true);
    } else if (password !== confirmPassword) {
      setError([VALIDATE.PASSWORD_MISMATCH]);
      setIsError(true);
      return;
    } else {
      // get access token
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        sessionStorage.setItem('message', USER.SESSION_EXP);
        navigate('/');
        return;
      }

      // request body
      const passwordDetails = {
        oldPassword: oldPassword,
        newPassword: password,
      };

      api
        .put('/api/v1/user/password', passwordDetails, {
          headers: {
            Authorization: `"${accessToken}"`,
          },
        })
        .then((res) => {
          if (res.data.success === true) {
            onSuccess(res.data.response.data.message);
            onClose();
          }
        })
        .catch((error) => {
          if (error.response) {
            const responseData = error.response.data.response?.data;

            if (Array.isArray(responseData)) {
              const messages = responseData.map((err) => err.message).filter(Boolean);
              setError(messages);
            } else if (typeof responseData === 'object' && responseData.message) {
              setError([responseData.message]);
            }

            setIsError(true);
          }
        });
    }
  };

  useEffect(() => {
    setOldPassword('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setIsError(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div>
      {/* update password popup */}
      <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg relative">
          {/* close button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
            <CircleX size={28} />
          </button>

          {/* popup title */}
          <h2 className="text-2xl font-bold mb-4">Update Password</h2>

          {/* password form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* current password */}
            <div className="flex flex-col gap-1">
              <input
                type="password"
                value={oldPassword}
                onChange={handleOldPasswordChange}
                placeholder="Current Password"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* new password */}
            <div className="flex flex-col gap-1">
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Current Password"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* confrim password */}
            <div className="flex flex-col gap-1">
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfrimPasswordChange}
                placeholder="New Password"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* error box */}
            {isError &&
              Array.isArray(error) &&
              error.map((msg, index) => (
                <div key={index} className="my-1 w-full py-2 bg-red-500 text-white px-4 rounded-md text-sm text-center mt-0">
                  {msg}
                </div>
              ))}

            {/* submit password */}
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer mt-0">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordPopup;
