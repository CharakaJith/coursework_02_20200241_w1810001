import axios from 'axios';
import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { USER, VALIDATE } from '@/common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function DetailsPopup({ isOpen, onClose, onSuccess, user = {} }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');

  const [error, setError] = useState([]);
  const [isError, setIsError] = useState(false);

  // handle first name change
  const handleFirstnameChange = (e) => {
    const firstName = e.target.value;
    setFirstName(firstName);

    if (firstName.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle last name change
  const handleLastnameChange = (e) => {
    const lastName = e.target.value;
    setLastName(lastName);

    if (lastName.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle mobile change
  const handleMobileChange = (e) => {
    const mobile = e.target.value;
    setMobile(mobile);

    if (mobile.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // validate form fields
    if (!firstName || firstName.trim().length === 0 || !lastName || lastName.trim().length === 0 || !mobile || mobile.trim().length === 0) {
      setError([VALIDATE.EMPTY_FIELDS]);
      setIsError(true);
    } else {
      // get access token
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        sessionStorage.setItem('message', USER.SESSION_EXP);
        navigate('/');
        return;
      }

      // request body
      const userDetails = {
        firstName: firstName,
        lastName: lastName,
        phone: mobile,
      };

      api
        .put('/api/v1/user', userDetails, {
          headers: {
            Authorization: `"${accessToken}"`,
          },
        })
        .then((res) => {
          if (res.data.success === true) {
            onSuccess(USER.UPDATED);
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

  // set user details
  useEffect(() => {
    if (isOpen && user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setMobile(user.phone || '');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div>
      {/* update info popup */}
      <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg relative">
          {/* close button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
            <CircleX size={28} />
          </button>

          {/* popup title */}
          <h2 className="text-2xl font-bold mb-4">Update User Details</h2>

          {/* details form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/* first name */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={firstName}
                onChange={handleFirstnameChange}
                placeholder="Firstname"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* last name */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={lastName}
                onChange={handleLastnameChange}
                placeholder="Lastname"
                className="border border-gray-300 rounded-lg p-2"
              />
            </div>

            {/* mobile */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={mobile}
                onChange={handleMobileChange}
                placeholder="Mobile number"
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
              Update Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DetailsPopup;
