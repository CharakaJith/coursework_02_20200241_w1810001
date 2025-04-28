import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCcw, ThumbsUp, ThumbsDown, Reply } from 'lucide-react';
import { USER } from '../../common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function PostDisplay() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [comments, setComments] = useState({});

  const navigate = useNavigate();

  // handle comment on change
  const handleCommentOnChange = (postId, e) => {
    const newComments = { [postId]: e.target.value };

    setComments({
      ...newComments,
    });
  };

  // handle search
  const handleSearch = () => {
    setFilteredPosts(
      posts.filter((post) => {
        return post.title.toLowerCase().includes(search.toLowerCase()) || post.content.toLowerCase().includes(search.toLowerCase());
      })
    );
  };

  // handle enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // handle refresh
  const handleRefresh = () => {
    setSearch('');
    fetchPosts();

    handleGoToTop();
  };

  // handle go to top
  const handleGoToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // fetch blog posts
  const fetchPosts = () => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    api
      .get('/api/v1/post/all', {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          const posts = res.data.response.data.posts;
          setPosts(posts);
          setFilteredPosts(posts);
        }
      })
      .catch((error) => {
        // check if access token expire
        if (error.response.data.response.status === 401) {
          sessionStorage.clear();

          sessionStorage.setItem('signupMessage', USER.SESSION_EXP);
          navigate('/');

          return;
        }
      });
  };

  // fetch all blog posts
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {/* search area */}
      <div className="sticky top-0 bg-white z-10 flex flex-1 flex-col pt-4 pl-4 pr-4">
        <div className="w-full max-w-full min-h-12 flex items-center gap-2">
          {/* search bar */}
          <input
            type="text"
            placeholder="Search blog posts....."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-[#f2f4f7] text-black rounded-xl px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#94B4C1]"
          />

          {/* search button */}
          <button
            className="bg-[#578FCA] hover:bg-[#3674B5] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200"
            onClick={handleSearch}
          >
            <Search />
          </button>

          {/* refersh button */}
          <button
            className="bg-[#48A6A7] hover:bg-[#357D7D] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200"
            onClick={handleRefresh}
          >
            <RefreshCcw />
          </button>
        </div>
      </div>

      {/* post display area */}
      {filteredPosts.length !== 0 ? (
        // post blocks
        <div className="flex flex-1 flex-col items-center p-4">
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            {filteredPosts.map((post, i) => (
              <div
                key={post.id || i}
                className="rounded-xl bg-[#ECEBDE] flex flex-col p-6 transition-transform duration-300 ease-in-out hover:scale-[1.02] cursor-pointer hover:bg-[#D7D3BF] shadow-md"
              >
                {/* title and flag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold leading-tight">{post.title}</div>
                  <img src={post.Country.flagUrl} alt="Country Flag" className="w-12 h-12 object-contain rounded-xl" />
                </div>

                <hr className="mx-0 my-2 border-t border-[#1a2533]" />

                {/* content */}
                <div className="text-base leading-snug mt-4">{post.content}</div>

                <hr className="mx-0 my-2 border-t border-[#8C96A0] mt-4" />

                {/* action buttons and comment*/}
                <div className="flex items-center gap-4 mt-4">
                  {/* like */}
                  <button className="bg-[#76A55E] hover:bg-[#5F8F4E] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200">
                    <ThumbsUp />
                  </button>

                  {/* dislike */}
                  <button className="bg-[#D77D72] hover:bg-[#B86A5C] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200">
                    <ThumbsDown />
                  </button>

                  {/* comment input */}
                  <input
                    type="text"
                    value={comments[post.id] || ''}
                    onChange={(e) => handleCommentOnChange(post.id, e)}
                    placeholder="Share your thoughts....."
                    className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#94B4C1] text-black"
                  />

                  {/* comment post */}
                  <button className="bg-[#4A90E2] hover:bg-[#357ABD] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200">
                    <Reply />
                  </button>
                </div>
              </div>
            ))}

            {/* go to top button */}
            <button
              onClick={handleGoToTop}
              className="rounded-xl bg-[#48A6A7] hover:bg-[#357D7D] text-white text-lg font-semibold px-6 py-3 transition-colors duration-200 shadow-md cursor-pointer"
            >
              Go To Top
            </button>
          </div>
        </div>
      ) : (
        // no post indicate text
        <div className="flex flex-1 flex-col p-4">
          <div className="w-full max-w-full min-h-12 bg-muted flex items-center justify-center text-black rounded-xl italic text-lg">
            Looks like it's a bit quiet here.....
          </div>
        </div>
      )}
    </div>
  );
}

export default PostDisplay;
