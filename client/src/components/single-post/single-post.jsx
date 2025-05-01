import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCcw, Trash, Pencil, ThumbsUp, ThumbsDown, MessageSquare, Plus, Reply } from 'lucide-react';
import ConfirmPopup from '@/modals/confrim-popup';
import InfoPopup from '@/modals/info-popup';
import PostPopup from '@/modals/post-popup';
import { USER, REACT, COMMENT, POSTS, MODAL } from '@/common/messages';
import { POST } from '@/constants/post.constant';

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
});

function SinglePost({ postId }) {
  const [post, setPost] = useState({});
  const [postComments, setPostComments] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [comment, setComment] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');

  const [postType, setPostType] = useState('');
  const [postEdit, setPostEdit] = useState({});
  const [postOpen, setPostOpen] = useState(false);

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const navigate = useNavigate();

  // handle react
  const handleReact = (react) => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    const reactDetails = {
      postId: postId,
      isLike: react,
    };

    api
      .post('/api/v1/react', reactDetails, {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          // open info modal
          setInfoMessage(react ? REACT.LIKE : REACT.DISLIKE);
          setInfoOpen(true);

          fetchPost();
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

  // handle comment on change
  const handleCommentOnChange = (e) => {
    setComment(e.target.value);
  };

  // handle comment
  const handleComment = () => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    const commentDetails = {
      postId: postId,
      content: comment,
    };

    // validate details
    if (!commentDetails.postId || !commentDetails.content) {
      setInfoMessage(COMMENT.EMPTY);
      setInfoOpen(true);
    } else {
      api
        .post('/api/v1/comment', commentDetails, {
          headers: {
            Authorization: `"${accessToken}"`,
          },
        })
        .then((res) => {
          if (res.data.success === true) {
            // open info modal
            setInfoMessage(COMMENT.POSTED);
            setInfoOpen(true);

            setComment('');
            fetchPost();
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

  // confrim delete
  const handleDelete = () => {
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
          setConfirmOpen(false);

          // set info message
          setInfoMessage(POSTS.DELETED);
          setInfoOpen(true);

          // go back
          navigate(-1);
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

  // handle update
  const handleUpdate = () => {
    setPostType(POST.TYPE.UPDATE);
    setPostEdit(post);
    setPostOpen(true);
  };

  // update post popup success
  const onSuccess = (message) => {
    setInfoMessage(message);
    setInfoOpen(true);

    fetchPost();
  };

  // fetch post
  const fetchPost = () => {
    // validate access token
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      sessionStorage.setItem('message', USER.SESSION_EXP);
      navigate('/');

      return;
    }

    api
      .get(`/api/v1/post/single/${postId}`, {
        headers: {
          Authorization: `"${accessToken}"`,
        },
      })
      .then((res) => {
        if (res.data.success === true) {
          const post = res.data.response.data.post;
          console.log(post);

          setPost(post);
          setPostComments(post.Comments);
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

  useEffect(() => {
    if (currentUser.id) {
      fetchPost();
    }
  }, [currentUser]);

  return (
    <div className="px-4 py-6">
      {/* post display area */}
      <div className="rounded-2xl bg-[#F9F9F6] flex flex-col p-8 shadow-lg border border-[#e0dfd7]">
        {/* title and flag */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{post.title}</h2>
            <p className="text-gray-600 text-lg mt-2 font-bold italic">Visited on: {new Date(post.visitDate).toLocaleDateString('en-GB')}</p>
          </div>
          <div className="flex flex-col items-center">
            <img src={post.Country?.flagUrl} alt="Country Flag" className="w-40 h-20 rounded-xl" />
            <p className="mt-2 text-sm text-gray-700 font-medium text-center">
              {post.Country?.officialName} ({post.Country?.commonName})
            </p>
          </div>
        </div>

        <hr className="border-t border-gray-300 mb-4" />

        {/* post content */}
        <p className="text-base leading-relaxed text-gray-700">{post.content}</p>

        <hr className="border-t border-gray-300 my-6" />

        {/* post status */}
        <div className="flex items-center justify-end gap-8 text-sm text-gray-700">
          {/* likes */}
          <div className="flex flex-col items-center">
            <ThumbsUp className="w-5 h-5 text-green-600" />
            <span className="mt-1">{post.Likes?.filter((l) => l.isLike).length ?? 0} Likes</span>
          </div>

          {/* dislikes */}
          <div className="flex flex-col items-center">
            <ThumbsDown className="w-5 h-5 text-[#BE3D2A]" />
            <span className="mt-1">{post.Likes?.filter((l) => !l.isLike).length ?? 0} Dislikes</span>
          </div>

          {/* comments */}
          <div className="flex flex-col items-center">
            <MessageSquare className="w-5 h-5 text-[#4A90E2]" />
            <span className="mt-1">
              {post.Comments?.length ?? 0} {post.Comments?.length === 1 ? 'Comment' : 'Comments'}
            </span>
          </div>
        </div>

        {/* action buttons */}
        <div className="mt-6">
          {post.userId !== currentUser.id ? (
            <div className="flex flex-wrap items-center gap-4">
              {/* like button */}
              <button
                onClick={() => handleReact(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <ThumbsUp />
              </button>

              {/* dislike button */}
              <button
                onClick={() => handleReact(false)}
                className="bg-[#BE3D2A] hover:bg-[#952E1E] text-white px-4 py-2 rounded-xl transition cursor-pointer"
              >
                <ThumbsDown />
              </button>

              {/* comment input */}
              <input
                type="text"
                value={comment}
                onChange={handleCommentOnChange}
                placeholder="Share your thoughts..."
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-black"
              />

              {/* comment button */}
              <button onClick={handleComment} className="bg-[#4A90E2] hover:bg-[#357ABD] text-white px-4 py-2 rounded-xl transition cursor-pointer">
                <Reply />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {/* delete button */}
              <button onClick={handleDelete} className="bg-[#BE3D2A] hover:bg-[#952E1E] text-white px-4 py-2 rounded-xl transition cursor-pointer">
                <Trash />
              </button>

              {/* edit button */}
              <button onClick={handleUpdate} className="bg-[#FFD95F] hover:bg-[#E6B92E] text-white px-4 py-2 rounded-xl transition cursor-pointer">
                <Pencil />
              </button>
            </div>
          )}
        </div>

        {/* comment section */}
        <div className="mt-8">
          {postComments.length !== 0 ? (
            postComments.map((comment, i) => (
              <div key={comment.id || i} className="mt-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {comment.User ? `${comment.User.firstName} ${comment.User.lastName}` : 'Deleted User'}
                </p>
                <p className="text-gray-700 text-sm">{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="mt-4 p-4 bg-[#f4f4f4] text-center text-gray-500 italic rounded-xl shadow-inner">
              No comments yet - only visitors can leave a comment.
            </div>
          )}
        </div>
      </div>

      {/* confrim popup modal */}
      <ConfirmPopup
        isOpen={confirmOpen}
        onConfirm={confrimDelete}
        onCancel={() => setConfirmOpen(false)}
        title={confirmTitle}
        message={confirmMessage}
      />

      {/* post edit popup modal */}
      <PostPopup
        isOpen={postOpen}
        onClose={() => setPostOpen(false)}
        onSuccess={onSuccess}
        mode={postType}
        post={postType === POST.TYPE.UPDATE ? postEdit : {}}
      />

      {/* info popup modal */}
      <InfoPopup isOpen={infoOpen} message={infoMessage} onClose={() => setInfoOpen(false)} />
    </div>
  );
}

export default SinglePost;
