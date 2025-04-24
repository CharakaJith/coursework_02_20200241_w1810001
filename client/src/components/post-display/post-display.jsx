import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RotateCcw, RefreshCcw } from 'lucide-react';
import { USER } from '../../common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function PostDisplay() {
  const [posts, setPosts] = useState([]);
  const [showPosts, setShowPosts] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  const navigate = useNavigate();

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
          setShowPosts(true);
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
      <div className="flex flex-1 flex-col pt-4 pl-4 pr-4">
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
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-5">
            {filteredPosts.map((post, i) => (
              // post container
              <div
                key={post.id || i}
                className="rounded-xl bg-[#ECEBDE] flex flex-col p-4 transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer hover:bg-[#D7D3BF]"
              >
                {/* post title and image */}
                <div className="flex items-center justify-between mb-1">
                  <div className="text-lg font-bold leading-tight">{post.title}</div>
                  <img src={post.Country.flagUrl} alt="Country Flag" className="w-15 h-15 object-contain rounded-2xl" />
                </div>

                <hr className="mx-0 my-2 border-t border-[#1a2533]" />

                {/* post content */}
                <div className="text-sm leading-snug">{post.content.length > 350 ? post.content.slice(0, 350) + '...' : post.content}</div>
              </div>
            ))}
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
