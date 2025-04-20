import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { VALIDATE, USER } from '../../common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function SignUpForm({ goToLogin }) {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);

  // handle first name on change
  const handleFirstnameChange = (e) => {
    const firstnameValue = e.target.value;
    setFirstname(firstnameValue);

    if (firstnameValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle last name on change
  const handleLastnameChange = (e) => {
    const lastnameValue = e.target.value;
    setLastname(lastnameValue);

    if (lastnameValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle email on change
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (emailValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle phone on change
  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;
    setPhone(phoneValue);

    if (phoneValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle password on change
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

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // validate form fields
    if (
      !firstname ||
      firstname.trim().length === 0 ||
      !lastname ||
      lastname.trim().length === 0 ||
      !email ||
      email.trim().length === 0 ||
      !password ||
      password.trim().length === 0 ||
      !confirmPassword ||
      confirmPassword.trim().length === 0
    ) {
      setError([VALIDATE.EMPTY_FIELDS]);
      setIsError(true);
    } else {
      // request body
      const userData = {
        firstName: firstname,
        lastName: lastname,
        phone: phone,
        email: email,
        password: password,
      };

      api
        .post('/api/v1/user', userData, {})
        .then((res) => {
          if (res.data.success === true) {
            goToLogin?.(); // open login form
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

  // handle go to login
  const handleGoToLogin = () => {
    goToLogin?.(); // open login form
  };

  // check password and confrim password on change
  useEffect(() => {
    if (confirmPassword && password && confirmPassword !== password) {
      setIsError(true);
      setError([VALIDATE.PASSWORD_MISMATCH]);
    } else if (isError && error[0] === VALIDATE.PASSWORD_MISMATCH) {
      setIsError(false);
      setError([]);
    }
  }, [password, confirmPassword]);

  return (
    <div className="w-full max-w-lg p-8 rounded-4xl shadow-lg bg-blue-950 text-white">
      {/* form heading */}
      <h2 className="text-2xl font-bold text-center mb-1">Create a new account</h2>
      <p className="font-semibold text-center mb-6">It's quick and easy!</p>

      {/* sign up form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Input
            type="text"
            value={firstname}
            onChange={handleFirstnameChange}
            placeholder="First name"
            className="mt-2 w-full p-3 border placeholder-gray-200"
          />
        </div>

        <div className="mb-4">
          <Input
            type="text"
            value={lastname}
            onChange={handleLastnameChange}
            placeholder="Last name"
            className="mt-2 w-full p-3 border placeholder-gray-200"
          />
        </div>

        <div className="mb-4">
          <Input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email address"
            className="mt-2 w-full p-3 border placeholder-gray-200"
          />
        </div>

        <div className="mb-4">
          <Input
            type="text"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="Mobile number"
            className="mt-2 w-full p-3 border placeholder-gray-200"
          />
        </div>

        <div className="mb-4">
          <Input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
            className="mt-2 w-full p-3 border placeholder-gray-200"
          />
        </div>

        <div className="mb-6">
          <Input
            type="password"
            value={confirmPassword}
            onChange={handleConfrimPasswordChange}
            placeholder="Confirm password"
            className="mt-2 w-full p-3 border placeholder-gray-200"
          />
        </div>

        {/* error box */}
        {isError &&
          Array.isArray(error) &&
          error.map((msg, index) => (
            <div key={index} className="my-3 w-full py-3 bg-red-500 text-white px-4 rounded-md text-sm">
              {msg}
            </div>
          ))}

        {/* sign up button */}
        <Button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Sign Up
        </Button>
      </form>

      {/* log in  */}
      <p className="mt-4 text-center text-sm text-shadow-indigo-50">
        Already have an account?{'  '}
        <span className="text-blue-300 hover:text-blue-500 cursor-pointer" onClick={handleGoToLogin}>
          Log In
        </span>
      </p>
    </div>
  );
}

export default SignUpForm;
