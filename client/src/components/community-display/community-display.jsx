import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCcw, Trash, Pencil, ThumbsUp, ThumbsDown, MessageSquare, Plus, User } from 'lucide-react';

import { USER } from '../../common/messages';

import Profile from '../../assets/images/profile.png';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function CommunityDisplay() {
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

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
      <div className="flex flex-1 flex-col pt-4 pl-4 pr-4">
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
                className="rounded-xl bg-[#ECEBDE] flex flex-col items-center p-4 transition-transform duration-300 ease-in-out hover:scale-105 cursor-pointer hover:bg-[#D7D3BF]"
              >
                {/* profile picture */}
                <div className="w-40 h-40 rounded-full overflow-hidden">
                  <img src={Profile} alt="Profile" className="w-full h-full object-cover" />
                </div>

                {/* name */}
                <div className="text-lg font-bold text-center">{`${user.firstName} ${user.lastName}`}</div>

                <hr className="w-full mx-0 my-4 border-t border-[#1a2533]" />

                {/* user details */}
                <div className="flex justify-around w-full">
                  {/* follow */}
                  <div className="flex flex-col items-center">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer">
                      <Plus size={10} />
                    </button>
                    <span className="text-xs mt-1">Follow</span>
                  </div>

                  {/* posts */}
                  <div className="flex flex-col items-center">
                    <MessageSquare size={27} />
                    <span className="text-xs mt-1">{user.Posts?.length} Posts</span>
                  </div>

                  {/* total likes */}
                  <div className="flex flex-col items-center">
                    <ThumbsUp size={27} />
                    <span className="text-xs mt-1">{user.likesCount || 0} Likes</span>
                  </div>
                </div>
              </div>
            ))}
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
    </div>
  );
}

export default CommunityDisplay;
