import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';
import InfoPopup from '@/modals/info-popup';
import PasswordPopup from '@/modals/password-popup';
import DetailsPopup from '@/modals/details-popup';
import { USER } from '@/common/messages';

import Profile from '@/assets/images/profile.png';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function UserDisplay({ userId }) {
  const [user, setUser] = useState({});
  const [currentUser, setCurrentUser] = useState({});

  const [passwordOpen, setPasswordOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const navigate = useNavigate();

  // handle refresh
  const handleRefresh = () => {
    fetchUser();
  };

  // handle post click
  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  // handle update password click
  const handlePasswordClick = () => {
    setPasswordOpen(true);
  };

  // on password update success
  const onPasswordSuccess = (message) => {
    setInfoMessage(message);
    setInfoOpen(true);

    // logout user
    sessionStorage.clear();
    navigate('/');
  };

  // handle update details click
  const handleDetailsClick = () => {
    setDetailsOpen(true);
  };

  // on detail update success
  const onDetailSuccess = (message) => {
    setInfoMessage(message);
    setInfoOpen(true);

    fetchUser();
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

  // fetch user
  const fetchUser = () => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    api
      .get(`/api/v1/user/${userId}`, {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          setUser(res.data.response.data.user);
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

  // fetch user
  useEffect(() => {
    if (currentUser.id) {
      fetchUser();
    }
  }, [currentUser]);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg m-4 space-y-6 border border-gray-100">
      {/* user info */}
      <div className="text-center space-y-2">
        <img src={Profile} alt="User Avatar" className="w-50 h-50 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-800">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-gray-500">{user.email}</p>
        <p className="text-sm text-gray-500">{user.phone}</p>
        <p className="text-sm text-gray-500">
          {' '}
          Active member since{' '}
          {new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p className={`text-sm font-medium ${user.isActive ? 'text-green-600' : 'text-red-500'}`}>{user.isActive ? '● Active' : '● Inactive'}</p>
      </div>

      <hr className="border-gray-200" />

      {/* follower stats */}
      <div className="grid grid-cols-5 gap-4 text-center">
        {/* posts */}
        <div className="flex flex-col items-center">
          <MessageSquare className="text-[#4A90E2]" size={22} />
          <span className="text-gray-700 font-medium">{user.Posts?.length || 0}</span>
          <span className="text-sm text-gray-500">Posts</span>
        </div>

        {/* likes */}
        <div className="flex flex-col items-center">
          <ThumbsUp className="text-green-600" size={22} />
          <span className="text-gray-700 font-medium">
            {user.Posts?.reduce((total, post) => {
              return total + (post.Likes?.filter((like) => like.isLike).length || 0);
            }, 0)}{' '}
          </span>
          <span className="text-sm text-gray-500">Total Likes</span>
        </div>

        {/* dislikes */}
        <div className="flex flex-col items-center">
          <ThumbsUp className="text-[#BE3D2A]" size={22} />
          <span className="text-gray-700 font-medium">
            {user.Posts?.reduce((total, post) => {
              return total + (post.Likes?.filter((like) => !like.isLike).length || 0);
            }, 0)}{' '}
          </span>
          <span className="text-sm text-gray-500">Total Disikes</span>
        </div>

        {/* followers */}
        <div className="flex flex-col items-center space-y-1">
          <UserPlus className="text-purple-600" size={22} />
          <span className="text-gray-700 font-medium">{user.Followers?.length || 0}</span>
          <span className="text-sm text-gray-500">Followers</span>
        </div>

        {/* following */}
        <div className="flex flex-col items-center space-y-1">
          <Users className="text-teal-600" size={22} />
          <span className="text-gray-700 font-medium">{user.Following?.length || 0}</span>
          <span className="text-sm text-gray-500">Following</span>
        </div>
      </div>

      {/* action buttons */}
      {user.id !== currentUser.id ? (
        <>
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
        </>
      ) : (
        <>
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleDetailsClick}
              className="flex-1 bg-[#7BD389] hover:bg-[#60B56D] cursor-pointer text-black font-bold py-2 rounded-full text-sm"
            >
              Update User Details
            </button>
            <button
              onClick={handlePasswordClick}
              className="flex-1 bg-[#FFD95F] hover:bg-[#E6B92E] cursor-pointer text-black font-bold py-2 rounded-full text-sm"
            >
              Update Password
            </button>
          </div>
        </>
      )}

      <hr />

      {/* posts */}
      {Array.isArray(user.Posts) && user.Posts.length > 0 ? (
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-col gap-3">
            {user.Posts.map((post, i) => (
              <div key={post.id || i} className="flex items-center justify-between gap-4">
                {/* post display card */}
                <div
                  onClick={() => handlePostClick?.(post.id)}
                  className="flex-1 rounded-xl bg-[#F9F9F6] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 cursor-pointer hover:bg-[#E0E0DC]"
                >
                  <div className="flex-1">
                    <div className="text-lg font-bold mb-1">
                      {post.title}{' '}
                      <span className="text-sm italic text-gray-500">(published on {new Date(post.createdAt).toLocaleDateString('en-GB')})</span>
                    </div>
                    <div className="text-sm text-gray-700">{post.content.slice(0, 150)}...</div>
                  </div>
                </div>

                {/* status */}
                <div className="flex items-center gap-8 mr-5 ml-5">
                  <div className="flex flex-col items-center text-[#007F73] hover:scale-125 transition-transform duration-200 cursor-pointer">
                    <ThumbsUp className="w-6 h-6" />
                    <span className="text-sm font-semibold">{post.Likes?.filter((l) => l.isLike)?.length || 0}</span>
                  </div>
                  <div className="flex flex-col items-center text-[#BE3D2A] hover:scale-125 transition-transform duration-200 cursor-pointer">
                    <ThumbsDown className="w-6 h-6" />
                    <span className="text-sm font-semibold">{post.Likes?.filter((l) => !l.isLike)?.length || 0}</span>
                  </div>
                  <div className="flex flex-col items-center text-[#49108B] hover:scale-125 transition-transform duration-200 cursor-pointer">
                    <MessageSquare className="w-6 h-6" />
                    <span className="text-sm font-semibold">{post.Comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 py-6">No posts to display.</p>
      )}

      {/* update details popup */}
      <DetailsPopup
        isOpen={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
        }}
        onSuccess={onDetailSuccess}
        user={user}
      />

      {/* update password popup */}
      <PasswordPopup
        isOpen={passwordOpen}
        onClose={() => {
          setPasswordOpen(false);
        }}
        onSuccess={onPasswordSuccess}
      />

      {/* info popup modal */}
      <InfoPopup isOpen={infoOpen} message={infoMessage} onClose={() => setInfoOpen(false)} />
    </div>
  );
}

export default UserDisplay;
