import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCcw, Trash, Pencil, ThumbsUp, ThumbsDown, MessageSquare, Plus } from 'lucide-react';
import ConfirmPopup from '@/modals/confrim-popup';
import InfoPopup from '@/modals/info-popup';
import PostPopup from '@/modals/post-popup';
import { USER, MODAL, POSTS } from '@/common/messages';
import { POST } from '@/constants/post.constant';
import { FILTER } from '@/constants/filter.constants';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState('');

  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState('');
  const [selectedSortBy, setSelectedSortBy] = useState('');

  const [postId, setPostId] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  const [postType, setPostType] = useState('');
  const [postEdit, setPostEdit] = useState({});
  const [postOpen, setPostOpen] = useState(false);

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

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

  // handle post click
  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  // handle update
  const handleUpdateClick = (post) => {
    setPostType(POST.TYPE.UPDATE);
    setPostEdit(post);
    setPostOpen(true);
  };

  // handle create
  const handleCreateClick = () => {
    setPostType(POST.TYPE.CREATE);
    setPostOpen(true);
  };

  // handle refresh
  const handleRefresh = () => {
    setSearch('');
    fetchPosts();

    resetFilters();
  };

  // handle go to top
  const handleGoToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // confrim delete
  const handleDelete = (postId) => {
    setPostId(postId);

    setConfirmTitle(MODAL.DELETE_POST.TITLE);
    setConfirmMessage(MODAL.DELETE_POST.MESSAGE);
    setConfirmOpen(true);

    // close in 30 seconds
    setTimeout(() => setConfirmOpen(false), 30000);
  };

  // handle delete
  const confrimDelete = () => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    api
      .delete(`/api/v1/post/${postId}`, {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
          setConfirmOpen(false);

          // set info message
          setInfoMessage(POSTS.DELETED);
          setInfoOpen(true);
        }
      })
      .catch((error) => {
        // check if access token expire
        if (error.response.data.response.status === 401) {
          sessionStorage.setItem('signupMessage', USER.SESSION_EXP);
          navigate('/');
          return;
        }
      });
  };

  // apply filters
  const applyFilters = (newSearch = search, newCountry = selectedCountry, newDateRange = selectedDateRange, newSortBy = selectedSortBy) => {
    let updatedPosts = [...posts];

    // filter by search
    if (newSearch.trim()) {
      updatedPosts = updatedPosts.filter(
        (post) => post.title.toLowerCase().includes(newSearch.toLowerCase()) || post.content.toLowerCase().includes(newSearch.toLowerCase())
      );
    }

    // filter by country
    if (newCountry.trim()) {
      updatedPosts = updatedPosts.filter((post) => post.Country?.commonName?.toLowerCase().trim() === newCountry.toLowerCase().trim());
    }

    // filter by date
    if (newDateRange) {
      const now = new Date();
      updatedPosts = updatedPosts.filter((post) => {
        const postDate = new Date(post.createdAt);
        if (isNaN(postDate)) return false;

        switch (newDateRange) {
          case FILTER.POST.DATE.LAST_24_HOURS:
            return now - postDate <= 24 * 60 * 60 * 1000;
          case FILTER.POST.DATE.LAST_7_DAYS:
            return now - postDate <= 7 * 24 * 60 * 60 * 1000;
          case FILTER.POST.DATE.LAST_30_DAYS:
            return now - postDate <= 30 * 24 * 60 * 60 * 1000;
          default:
            return true;
        }
      });

      // by oldest and newest
      if (newDateRange === FILTER.POST.DATE.OLDEST || newDateRange === FILTER.POST.DATE.NEWEST) {
        updatedPosts.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return newDateRange === FILTER.POST.DATE.OLDEST ? dateA - dateB : dateB - dateA;
        });
      }
    }

    // by likes and comments
    if (newSortBy) {
      switch (newSortBy) {
        case FILTER.POST.LIKE.MOST:
          updatedPosts.sort((a, b) => {
            const likesA = a.Likes?.filter((like) => like.isLike === true).length || 0;
            const likesB = b.Likes?.filter((like) => like.isLike === true).length || 0;
            return likesB - likesA;
          });
          break;
        case FILTER.POST.LIKE.LEAST:
          updatedPosts.sort((a, b) => {
            const likesA = a.Likes?.filter((like) => like.isLike === true).length || 0;
            const likesB = b.Likes?.filter((like) => like.isLike === true).length || 0;
            return likesA - likesB;
          });
          break;
        case FILTER.POST.LIKE.POPULAR:
          updatedPosts.sort((a, b) => b.Comments?.length - a.Comments?.length);
          break;
        case FILTER.POST.LIKE.UNPOPULAR:
          updatedPosts.sort((a, b) => a.Comments?.length - b.Comments?.length);
          break;
        default:
          break;
      }
    }

    setFilteredPosts(updatedPosts);
  };

  // reset filters
  const resetFilters = () => {
    setSearch('');
    setSelectedCountry('');
    setSelectedDateRange('');
    setSelectedSortBy('');

    // set posts
    setFilteredPosts([...posts]);
  };

  // fetch blog posts for user
  const fetchPosts = () => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    api
      .get('/api/v1/post/user', {
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
          sessionStorage.setItem('signupMessage', USER.SESSION_EXP);
          navigate('/');

          return;
        }
      });
  };

  // fetch countries
  const fetchCountries = () => {
    // validate access token
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
        // check if access token expire
        if (error.response.data.response.status === 401) {
          sessionStorage.clear();

          sessionStorage.setItem('message', USER.SESSION_EXP);
          navigate('/');

          return;
        }
      });
  };

  // update post popup success
  const onSuccess = (message) => {
    setInfoMessage(message);
    setInfoOpen(true);

    fetchPosts();
  };

  // fetch all blog posts
  useEffect(() => {
    fetchPosts();
    fetchCountries();
  }, []);

  return (
    <div>
      {/* search area */}
      <div className="sticky top-0 bg-white flex flex-1 flex-col p-2">
        <div className="w-full max-w-full min-h-12 flex flex-wrap items-center gap-x-2 gap-y-2">
          {/* filters */}
          <div className="flex flex-wrap gap-2">
            {/* filter by country */}
            <select
              value={selectedCountry}
              onChange={(e) => {
                const country = e.target.value;
                setSelectedCountry(country);
                applyFilters(search, country);
              }}
              className="bg-white border px-3 py-2 rounded-xl text-black w-40"
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country.id} value={country.commonName}>
                  {country.commonName}
                </option>
              ))}
            </select>

            {/* filter by date */}
            <select
              value={selectedDateRange}
              onChange={(e) => {
                const selectedRange = e.target.value;
                setSelectedDateRange(selectedRange);
                applyFilters(search, selectedCountry, selectedRange);
              }}
              className="bg-white border px-3 py-2 rounded-xl text-black w-40"
            >
              <option value="">Any Date</option>
              <option value={FILTER.POST.DATE.LAST_24_HOURS}>Last 24 Hours</option>
              <option value={FILTER.POST.DATE.LAST_7_DAYS}>Last 7 Days</option>
              <option value={FILTER.POST.DATE.LAST_30_DAYS}>Last 30 Days</option>
              <option value={FILTER.POST.DATE.NEWEST}>Newest First</option>
              <option value={FILTER.POST.DATE.OLDEST}>Oldest First</option>
            </select>

            {/* filter by likes */}
            <select
              value={selectedSortBy}
              onChange={(e) => {
                const sortBy = e.target.value;
                setSelectedSortBy(sortBy);
                applyFilters(search, selectedCountry, selectedDateRange, sortBy);
              }}
              className="bg-white border px-3 py-2 rounded-xl text-black w-40"
            >
              <option value="">Sort By</option>
              <option value={FILTER.POST.LIKE.MOST}>Most Liked</option>
              <option value={FILTER.POST.LIKE.LEAST}>Least Liked</option>
              <option value={FILTER.POST.LIKE.POPULAR}>Most Popular</option>
              <option value={FILTER.POST.LIKE.UNPOPULAR}>Least Popular</option>
            </select>
          </div>

          {/* action buttons */}
          <div className="flex items-center gap-2 flex-1">
            {/* search bar */}
            <input
              type="text"
              placeholder="Search blog posts..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onKeyDown={handleKeyPress}
              className="w-full bg-[#f2f4f7] text-black rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#94B4C1]"
            />

            {/* search button */}
            <button
              className="bg-[#578FCA] hover:bg-[#3674B5] cursor-pointer text-white px-4 py-3 rounded-xl transition-colors duration-200"
              onClick={handleSearch}
            >
              <Search />
            </button>

            {/* refersh button */}
            <button
              className="bg-[#48A6A7] hover:bg-[#357D7D] cursor-pointer text-white px-4 py-3 rounded-xl transition-colors duration-200"
              onClick={handleRefresh}
            >
              <RefreshCcw />
            </button>

            {/* create button */}
            <button
              className="bg-[#F1C40F] hover:bg-[#D4A20D] cursor-pointer text-white px-4 py-3 rounded-xl transition-colors duration-200"
              onClick={handleCreateClick}
            >
              <Plus />
            </button>

            {/* reset button */}
            <button
              className="bg-[#BE3D2A] hover:bg-[#952E1E] cursor-pointer text-white px-4 py-3 rounded-xl transition-colors duration-200"
              onClick={resetFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* post display area */}
      {filteredPosts.length !== 0 ? (
        // post blocks
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-col gap-3">
            {filteredPosts.map((post, i) => (
              <div key={post.id || i} className="flex items-center justify-between gap-4">
                {/* post display card */}
                <div
                  onClick={() => {
                    handlePostClick(post.id);
                  }}
                  className="flex-1 rounded-xl bg-[#F9F9F6] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 cursor-pointer hover:bg-[#E0E0DC]"
                >
                  <div className="flex-1">
                    <div className="text-lg font-bold mb-1">
                      {post.title}{' '}
                      <span className="text-sm leading-snug italic">(published on {new Date(post.createdAt).toLocaleDateString('en-GB')})</span>
                    </div>
                    <div className="text-sm leading-snug">{post.content.slice(0, 150) + '...'}</div>
                  </div>
                </div>

                {/* status */}
                <div className="flex items-center gap-8 mr-5 ml-5">
                  {/* likes */}
                  <div className="flex flex-col items-center text-[#007F73] transition-transform duration-200 hover:scale-125 cursor-pointer">
                    <ThumbsUp className="w-8 h-8" />
                    <span className="text-base font-bold">{post.Likes.filter((like) => like.isLike === true).length}</span>
                  </div>

                  {/* dislikes */}
                  <div className="flex flex-col items-center text-[#BE3D2A] transition-transform duration-200 hover:scale-125 cursor-pointer">
                    <ThumbsDown className="w-8 h-8" />
                    <span className="text-base font-bold">{post.Likes.filter((like) => like.isLike === false).length}</span>
                  </div>

                  {/* comments */}
                  <div className="flex flex-col items-center text-[#49108B] transition-transform duration-200 hover:scale-125 cursor-pointer">
                    <MessageSquare className="w-8 h-8" />
                    <span className="text-base font-bold">{post.Comments.length}</span>
                  </div>
                </div>

                {/* action buttons */}
                <div className="flex flex-col gap-2 items-center">
                  {/* delete button */}
                  <button
                    className="bg-[#BE3D2A] hover:bg-[#952E1E] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash />
                  </button>

                  {/* edit button */}
                  <button
                    className="bg-[#FFD95F] hover:bg-[#E6B92E] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200"
                    onClick={() => {
                      handleUpdateClick(post);
                    }}
                  >
                    <Pencil />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* button display area */}
          <div className="flex flex-1 flex-col items-center p-4">
            <div className="flex flex-col gap-6 w-full">
              {/* go to top button */}
              <button
                onClick={handleGoToTop}
                className="rounded-xl bg-[#48A6A7] hover:bg-[#357D7D] text-white text-lg font-semibold px-6 py-3 transition-colors duration-200 shadow-md cursor-pointer"
              >
                Go To Top
              </button>
            </div>
          </div>
        </div>
      ) : (
        // no post indicate text
        <div className="flex flex-1 flex-col p-4">
          <div className="w-full max-w-full min-h-12 bg-muted flex items-center justify-center text-black rounded-xl italic text-lg">
            Looks like it's a bit quiet here...
          </div>
        </div>
      )}

      {/* confrim popup modal */}
      <ConfirmPopup
        isOpen={confirmOpen}
        onConfirm={confrimDelete}
        onCancel={() => {
          setConfirmOpen(false);
        }}
        title={confirmTitle}
        message={confirmMessage}
      />

      {/* info popup modal */}
      <InfoPopup isOpen={infoOpen} message={infoMessage} onClose={() => setInfoOpen(false)} />

      {/* edit blog post popup */}
      <PostPopup
        isOpen={postOpen}
        onClose={() => {
          setPostOpen(false);
        }}
        onSuccess={onSuccess}
        mode={postType}
        post={postType === POST.TYPE.UPDATE ? postEdit : {}}
      />
    </div>
  );
}

export default MyPosts;
