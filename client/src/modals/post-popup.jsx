import axios from 'axios';
import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { POST } from '../constants/post.constant';
import { POSTS, USER, VALIDATE } from '../common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function PostPopup({ isOpen, onClose, onSuccess, mode = POST.TYPE.CREATE, post = {} }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visited, setVisited] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);

  const [error, setError] = useState('');
  const [isError, setIsError] = useState(false);

  // handle title change
  const handleTitleChange = (e) => {
    const titleValue = e.target.value;
    if (titleValue.length <= POST.LENGTH.TITLE) {
      setTitle(titleValue);
    }

    if (titleValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle content change
  const handleContentChange = (e) => {
    const contentValue = e.target.value;
    if (contentValue.length <= POST.LENGTH.CONTENT) {
      setContent(contentValue);
    }

    if (contentValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle visited change
  const handleVisitedChange = (e) => {
    const visitedValue = e.target.value;
    setVisited(visitedValue);

    if (visitedValue.trim().length > 0) {
      setIsError(false);
    }
  };

  // handle country change
  const handleCountryChange = (e) => {
    const countryValue = e.target.value;
    setCountry(countryValue);

    if (countryValue) {
      setIsError(false);
    }
  };

  // format date
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // fetch countries
  const fetchCountries = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');
      return;
    }

    api
      .get('/api/v1/country', {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          setCountries(res.data.response.data.countries);
        }
      })
      .catch((error) => {
        if (error.response?.data?.response?.status === 401) {
          sessionStorage.clear();
          sessionStorage.setItem('signupMessage', USER.SESSION_EXP);
          navigate('/');
        }
      });
  };

  // handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // validate form fields
    if (
      !title ||
      title.trim().length === 0 ||
      !content ||
      content.trim().length === 0 ||
      !visited ||
      visited.trim().length === 0 ||
      !country ||
      country.trim().length === 0
    ) {
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

      // create post
      if (mode === POST.TYPE.CREATE) {
        const createDetails = {
          title: title,
          content: content,
          countryId: parseInt(country, 10),
          visitDate: visited ? formatDate(visited) : '',
        };

        api
          .post('/api/v1/post', createDetails, {
            headers: {
              Authorization: `"${accessToken}"`,
            },
          })
          .then((res) => {
            if (res.data.success === true) {
              onSuccess(POSTS.CREATED);
              onClose();
            }
          })
          .catch((error) => {
            if (error.response?.data?.response?.status === 401) {
              sessionStorage.clear();
              sessionStorage.setItem('signupMessage', USER.SESSION_EXP);
              navigate('/');
            }

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
    }
  };

  useEffect(() => {
    // set values for update post
    if (isOpen && post && mode === POST.TYPE.UPDATE) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setVisited(post.visitDate || '');
      setCountry(post.Country && post.Country.id ? post.Country.id : '');
    }
    // clear form for new post
    else if (isOpen && mode === POST.TYPE.CREATE) {
      setTitle('');
      setContent('');
      setVisited('');
      setCountry('');
    }
  }, [isOpen]);

  useEffect(() => {
    fetchCountries();
  }, []);

  if (!isOpen) return null;

  return (
    <div>
      {/* post popup */}
      <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg relative">
          {/* close button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer">
            <CircleX size={28} />
          </button>

          <h2 className="text-2xl font-bold mb-4">{mode === 'create' ? 'Create New Post' : 'Update Blog Post'}</h2>

          {/* country form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Post Title"
                className="border border-gray-300 rounded-lg p-2"
              />
              <p className="text-sm text-gray-500 text-right">
                {title.length} / {POST.LENGTH.TITLE} characters
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <textarea
                placeholder="Content"
                value={content}
                onChange={handleContentChange}
                className="border border-gray-300 rounded-lg p-2 h-50 resize-none"
              />
              <p className="text-sm text-gray-500 text-right">
                {content.length} / {POST.LENGTH.CONTENT} characters
              </p>
            </div>

            <input
              type="date"
              value={visited}
              onChange={handleVisitedChange}
              className="border border-gray-300 rounded-lg p-2 cursor-pointer w-full"
            />

            <select value={country} onChange={handleCountryChange} className="border border-gray-300 rounded-lg p-2 cursor-pointer">
              <option value="">Select a country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.commonName}
                </option>
              ))}
            </select>

            {/* error box */}
            {isError &&
              Array.isArray(error) &&
              error.map((msg, index) => (
                <div key={index} className="my-1 w-full py-2 bg-red-500 text-white px-4 rounded-md text-sm text-center mt-0">
                  {msg}
                </div>
              ))}

            {/* submit button */}
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer mt-0">
              {mode === 'create' ? 'Publish' : 'Update'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PostPopup;
