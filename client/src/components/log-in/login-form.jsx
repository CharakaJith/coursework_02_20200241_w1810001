import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InfoPopup from '../..//modals/info-popup';
import { VALIDATE } from '../../common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function LoginForm({ goToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const navigate = useNavigate();

  // handle email on change
  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (emailValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle password on change
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPassword(password);

    if (password.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // validate form fields
    if (!email || email.trim().length === 0 || !password || password.trim().length === 0) {
      setError([VALIDATE.EMPTY_FIELDS]);
      setIsError(true);
    } else {
      // request body
      const userData = {
        email: email,
        password: password,
      };

      api
        .post('/api/v1/user/login', userData, {})
        .then((res) => {
          if (res.data.success === true) {
            // set access token
            const accessToken = res.headers['Access-Token'] || res.headers['access-token'];
            if (accessToken) {
              sessionStorage.setItem('accessToken', accessToken);
              sessionStorage.setItem('user', JSON.stringify(res.data.response.data.user));
            }

            navigate('/home');
          }
        })
        .catch((error) => {
          const responseData = error.response.data.response?.data;

          if (Array.isArray(responseData)) {
            const messages = responseData.map((err) => err.message).filter(Boolean);
            setError(messages);
          } else if (typeof responseData === 'object' && responseData.message) {
            setError([responseData.message]);
          }

          setIsError(true);
        });
    }
  };

  // handle go to signup
  const handleGoToSignup = () => {
    goToSignup?.(); // open signup form
  };

  // check pop up message
  useEffect(() => {
    const message = sessionStorage.getItem('message');
    if (message) {
      setInfoMessage(message);
      setInfoOpen(true);
    }
  }, []);

  return (
    <div className="w-full max-w-lg p-8 rounded-4xl shadow-lg bg-blue-950 text-white">
      {/* form heading */}
      <h2 className="text-2xl font-bold text-center mb-1">Log in to your account</h2>
      <p className="font-semibold text-center mb-6">Welcome back! Please enter your details.</p>

      {/* log in form */}
      <form onSubmit={handleSubmit}>
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
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Password"
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

        {/* log in button */}
        <Button
          type="submit"
          className="w-full py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Log In
        </Button>
      </form>

      {/* sign up  */}
      <p className="mt-4 text-center text-sm text-shadow-indigo-50">
        Don't have an account?{'  '}
        <span className="text-blue-300 hover:text-blue-500 cursor-pointer" onClick={handleGoToSignup}>
          Sign Up
        </span>
      </p>

      {/* info popup modal */}
      <InfoPopup isOpen={infoOpen} message={infoMessage} />
    </div>
  );
}

export default LoginForm;
