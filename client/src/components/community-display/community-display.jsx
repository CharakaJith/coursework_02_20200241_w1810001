import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCcw, ThumbsUp, ThumbsDown, UserPlus, Users, MessageSquare, Plus } from 'lucide-react';
import InfoPopup from '@/modals/info-popup';
import { USER } from '@/common/messages';

import Profile from '@/assets/images/profile.png';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function CommunityDisplay() {
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const navigate = useNavigate();

  // handle search
  const handleSearch = () => {
    setUsers(
      users.filter((user) => {
        return user.firstName.toLowerCase().includes(search.toLowerCase()) || user.lastName.toLowerCase().includes(search.toLowerCase());
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
    fetchUsers();
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

  // handle follow
  const handleFollow = (userId) => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    const followDetails = {
      followerId: userId,
    };

    api
      .post('/api/v1/user/follow', followDetails, {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          // open info modal
          setInfoMessage(USER.FOLLOWED);
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

        if (error.response.data.response.status === 403) {
          setInfoMessage(error.response.data.response.data.message);
          setInfoOpen(true);
        }
      });
  };

  // handle unfollow
  const handleUnfollow = (followId) => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    const followDetails = {
      followId: followId,
    };

    api
      .post('/api/v1/user/unfollow', followDetails, {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          // open info modal
          setInfoMessage(res.data.response.data.message);
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
  };

  // fetch users
  const fetchUsers = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    api
      .get('/api/v1/user', {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          const users = res.data.response.data.users;

          const allUsers = users.filter((user) => user.id !== currentUser.id);

          setUsers(allUsers);
        }
      })
      .catch((error) => {
        // check if access token expires
        if (error.response.data.response.status === 401) {
          sessionStorage.setItem('signupMessage', USER.SESSION_EXP);
          navigate('/');
          return;
        }
      });
  };

  useEffect(() => {
    // get logged in user
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    } else {
      sessionStorage.setItem('signupMessage', USER.SESSION_EXP);
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser.id) {
      fetchUsers();
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
            placeholder="Search users....."
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

          {/* refresh button */}
          <button
            className="bg-[#48A6A7] hover:bg-[#357D7D] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200"
            onClick={handleRefresh}
          >
            <RefreshCcw />
          </button>
        </div>
      </div>

      {/* user display area */}
      {users.length !== 0 ? (
        // user blocks
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            {users.map((user, i) => (
              <div
                key={user.id || i}
                onClick={() => {
                  handleUserClick(user.id);
                }}
                className="rounded-xl bg-[#F9F9F6] flex flex-col items-center p-4 hover:bg-[#E0E0DC] cursor-pointer"
              >
                {/* profile picture */}
                <div className="w-40 h-40 rounded-full overflow-hidden">
                  <img src={Profile} alt="Profile" className="w-full h-full object-cover" />
                </div>

                {/* name */}
                <div className="text-lg font-bold text-center">{`${user.firstName} ${user.lastName}`}</div>

                <hr className="w-full mx-0 my-4 border-t border-[#1a2533]" />

                {/* user stats */}
                <div className="flex justify-around w-full">
                  {/* posts */}
                  <div className="flex flex-col items-center">
                    <MessageSquare size={20} className="text-[#4A90E2]" />
                    <span className="text-xs mt-1">{user.Posts.length} Posts</span>
                  </div>

                  {/* likes */}
                  <div className="flex flex-col items-center">
                    <ThumbsUp size={20} className="text-green-600" />
                    <span className="text-xs mt-1">
                      {user.Posts?.reduce((total, post) => {
                        return total + (post.Likes?.filter((like) => like.isLike).length || 0);
                      }, 0)}{' '}
                      Likes
                    </span>
                  </div>

                  {/* dislikes */}
                  <div className="flex flex-col items-center">
                    <ThumbsDown size={20} className="text-[#BE3D2A]" />
                    <span className="text-xs mt-1">
                      {user.Posts?.reduce((total, post) => {
                        return total + (post.Likes?.filter((like) => !like.isLike).length || 0);
                      }, 0)}{' '}
                      Dislikes
                    </span>
                  </div>

                  {/* followers */}
                  <div className="flex flex-col items-center">
                    <UserPlus size={20} className="text-purple-600" />
                    <span className="text-xs mt-1">{user.Followers?.length || 0} Followers</span>
                  </div>

                  {/* following */}
                  <div className="flex flex-col items-center">
                    <Users size={20} className="text-teal-600" />
                    <span className="text-xs mt-1">{user.Following?.length || 0} Following</span>
                  </div>
                </div>

                {/* follow button */}
                {(() => {
                  const follower = user.Followers?.find((f) => f.id === currentUser.id);
                  return follower ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnfollow(follower.Follow.id);
                      }}
                      className="mt-4 w-full bg-[#BE3D2A] hover:bg-[#952E1E] cursor-pointer text-white py-2 rounded-full text-sm font-bold"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFollow(user.id);
                      }}
                      className="mt-4 w-full bg-[#4A90E2] hover:bg-[#357ABD] cursor-pointer text-white py-2 rounded-full text-sm font-bold"
                    >
                      Follow
                    </button>
                  );
                })()}
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
        // no user indicate text
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

export default CommunityDisplay;
