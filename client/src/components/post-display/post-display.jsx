import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCcw, ThumbsUp, ThumbsDown, Reply, MessageSquare } from 'lucide-react';
import InfoPopup from '@/modals/info-popup';
import { COMMENT, REACT, USER } from '@/common/messages';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function PostDisplay() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [currentUser, setCurrentUser] = useState({});

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

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
    setComments({});
    fetchPosts();
  };

  // handle post click
  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  // hancle user click
  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  // handle go to top
  const handleGoToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // handle react
  const handleReact = (id, react) => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    const reactDetails = {
      postId: id,
      isLike: react,
    };

    api
      .post('/api/v1/post/react', reactDetails, {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          // open info modal
          setInfoMessage(react ? REACT.LIKE : REACT.DISLIKE);
          setInfoOpen(true);

          handleRefresh();
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

        if (error.response.data.response.status === 400) {
          setInfoMessage(error.response.data.response.data.message);
          setInfoOpen(true);
        }
      });
  };

  // handel comment
  const handleComment = () => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    const commentDetails = {
      postId: Object.keys(comments)[0],
      content: Object.values(comments)[0],
    };

    // validate details
    if (!commentDetails.postId || !commentDetails.content) {
      setInfoMessage(COMMENT.EMPTY);
      setInfoOpen(true);
    } else {
      api
        .post('/api/v1/post/comment', commentDetails, {
          headers: {
            Authorization: `"${accessToken}"`,
          },
        })
        .then((res) => {
          if (res.data.success === true) {
            // open info modal
            setInfoMessage(COMMENT.POSTED);
            setInfoOpen(true);

            handleRefresh();
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
    }
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

          sessionStorage.setItem('message', USER.SESSION_EXP);
          navigate('/');

          return;
        }
      });
  };

  // get logged in user
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    } else {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');
    }
  }, [navigate]);

  // fetch all blog posts
  useEffect(() => {
    if (currentUser.id) {
      fetchPosts();
    }
  }, [currentUser]);

  return (
    <div>
      {/* search area */}
      <div className="sticky top-0 bg-white flex flex-1 flex-col pt-4 pl-4 pr-4">
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
          <div className="flex flex-col gap-6 w-full max-w-3xl">
            {filteredPosts.map((post, i) => (
              <div
                key={post.id || i}
                onClick={() => {
                  handlePostClick(post.id);
                }}
                className="rounded-xl bg-[#F9F9F6] flex flex-col p-6 hover:bg-[#E0E0DC] shadow-md cursor-pointer"
              >
                {/* title and flag */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold leading-tight">{post.title}</div>
                    <div className="text-sm leading-tight mt-2 italic">
                      posted by{' '}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUserClick(post.User.id);
                        }}
                        className="text-blue-500 hover:text-blue-800 cursor-pointer font-bold"
                      >
                        {currentUser.id === post.User.id ? 'You' : `${post.User.firstName} ${post.User.lastName}`}
                      </span>
                    </div>
                  </div>
                  <img src={post.Country.flagUrl} alt="Country Flag" className="w-12 h-12 object-contain rounded-2xl" />
                </div>

                <hr className="mx-0 my-2 border-t border-[#1a2533]" />

                {/* content */}
                <div className="text-base leading-snug mt-4">{post.content}</div>

                <hr className="mx-0 my-2 border-t border-[#8C96A0] mt-4" />

                {/* post status */}
                <div className="flex items-center gap-8 mt-4 justify-end">
                  <div className="flex flex-col items-center text-xs">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <p className="mt-1">{post.Likes.filter((like) => like.isLike === true).length} Likes</p>
                  </div>

                  <div className="flex flex-col items-center text-xs">
                    <ThumbsDown className="w-4 h-4 text-[#BE3D2A]" />
                    <p className="mt-1">{post.Likes.filter((like) => like.isLike === false).length} Dislikes</p>
                  </div>

                  <div className="flex flex-col items-center text-xs">
                    <MessageSquare className="w-4 h-4 text-[#4A90E2]" />
                    <p className="mt-1">
                      {post.Comments.length} {post.Comments.length === 1 ? ' Comment' : ' Comments'}
                    </p>
                  </div>
                </div>

                {/* action buttons and comment*/}
                {post.userId !== currentUser.id ? (
                  <>
                    <div className="flex items-center gap-4 mt-4">
                      {/* like button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReact(post.id, true);
                        }}
                        className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200"
                      >
                        <ThumbsUp />
                      </button>

                      {/* dislike button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReact(post.id, false);
                        }}
                        className="bg-[#BE3D2A] hover:bg-[#952E1E] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200"
                      >
                        <ThumbsDown />
                      </button>

                      {/* comment input box */}
                      <input
                        type="text"
                        value={comments[post.id] || ''}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleCommentOnChange(post.id, e)}
                        placeholder="Share your thoughts....."
                        className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#94B4C1] text-black"
                      />

                      {/* comment button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComment();
                        }}
                        className="bg-[#4A90E2] hover:bg-[#357ABD] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200"
                      >
                        <Reply />
                      </button>
                    </div>
                  </>
                ) : (
                  <></>
                )}
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

      {/* info popup modal */}
      <InfoPopup isOpen={infoOpen} message={infoMessage} onClose={() => setInfoOpen(false)} />
    </div>
  );
}

export default PostDisplay;
