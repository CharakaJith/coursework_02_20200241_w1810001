import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCcw, Trash, Pencil, ThumbsUp, ThumbsDown, MessageSquare, Plus } from 'lucide-react';
import ConfirmPopup from '@/modals/confrim-popup';
import InfoPopup from '@/modals/info-popup';
import PostPopup from '@/modals/post-popup';
import { USER, MODAL, POSTS } from '@/common/messages';
import { POST } from '@/constants/post.constant';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');

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
    setPosts(
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

  // update post popup success
  const onSuccess = (message) => {
    setInfoMessage(message);
    setInfoOpen(true);

    fetchPosts();
  };

  // fetch all blog posts
  useEffect(() => {
    fetchPosts();
  }, []);

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

          {/* create button */}
          <button
            className="bg-[#F1C40F] hover:bg-[#D4A20D] cursor-pointer text-white px-4 py-2 rounded-xl transition-colors duration-200"
            onClick={handleCreateClick}
          >
            <Plus />
          </button>
        </div>
      </div>

      {/* post display area */}
      {posts.length !== 0 ? (
        // post blocks
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex flex-col gap-3">
            {posts.map((post, i) => (
              <div key={post.id || i} className="flex items-center justify-between gap-4">
                {/* post display card */}
                <div
                  onClick={() => {
                    handlePostClick(post.id);
                  }}
                  className="flex-1 rounded-xl bg-[#ECEBDE] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 cursor-pointer hover:bg-[#D7D3BF]"
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
        </div>
      ) : (
        // no post indicate text
        <div className="flex flex-1 flex-col p-4">
          <div className="w-full max-w-full min-h-12 bg-muted flex items-center justify-center text-black rounded-xl italic text-lg">
            Looks like it's a bit quiet here.....
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
