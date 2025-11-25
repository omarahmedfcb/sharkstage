"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import api from "@/lib/axios";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  Send,
  Loader2,
  Trash2,
} from "lucide-react";
import DeleteAlert from "@/app/components/DeleteAlert";

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id;
  const { currentUser, isLoggedIn } = useSelector((state) => state.auth);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    if (postId) {
      fetchPostAndComments();
    }
  }, [postId]);

  const fetchPostAndComments = async () => {
    try {
      setLoading(true);
      const foundPost = await api.get(`/blog/${postId}`);
      setPost(foundPost.data.post);
      const commentsRes = await api.get(`/blog/post/${postId}`);
      setComments(commentsRes.data.postComments || []);
    } catch (err) {
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      setPostLoading(true);
      await api.post(`/blog/post/delete/${postId}`);
      router.push("/blog");
    } catch (error) {
      console.error("Error fetching post:", err);
    } finally {
      setPostLoading(false);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      setCommentLoading(true);
      await api.post(`/blog/comment/delete/${commentId}`);
      fetchPostAndComments();
    } catch (error) {
      console.error("Error fetching post:", err);
    } finally {
      setCommentLoading(false);
    }
  };

  const onSubmitComment = async (data) => {
    if (!isLoggedIn) {
      alert("Please login to comment");
      return;
    }

    try {
      await api.post("/blog/comment/add", {
        content: data.content,
        post: postId,
      });
      reset();
      fetchPostAndComments();
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen  bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Post not found</p>
          <button
            onClick={() => router.push("/blog")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-background-dark">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/blog")}
          className="flex items-center gap-2 text-gray-600 dark:text-paragraph hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Blog</span>
        </button>

        {/* Post Card */}
        <div className="bg-white dark:bg-background/10 dark:border-0 relative rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-6">
          {currentUser?.accountType == "admin" ||
          currentUser?._id == post.author?._id ? (
            <div className="absolute right-4 top-4">
              <DeleteAlert
                handleDelete={handleDeletePost}
                title={"Delete this post ?"}
                deleteLoading={postLoading}
              />
            </div>
          ) : null}

          {/* Author Info */}
          <div className="flex items-center gap-3 mb-6">
            {post.author?.profilePicUrl ? (
              <img
                src={post.author.profilePicUrl}
                alt={`${post.author.firstName} ${post.author.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary dark:to-heading flex items-center justify-center text-white font-semibold text-lg">
                {post.author?.firstName?.charAt(0)}
                {post.author?.lastName?.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-background text-lg">
                {post.author?.firstName} {post.author?.lastName}
              </p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>{formatTime(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-background mb-4">
            {post.title}
          </h1>
          <p className="text-gray-700 dark:text-paragraph text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Stats */}
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-background/10 rounded-2xl p-6 border border-gray-100 dark:border-0 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-background mb-6">
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          {isLoggedIn ? (
            <div className="mb-8 pb-8 border-b border-gray-100">
              <div className="flex gap-3">
                {currentUser?.profilePicUrl ? (
                  <img
                    src={currentUser.profilePicUrl}
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary dark:to-heading flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {currentUser?.firstName?.charAt(0)}
                    {currentUser?.lastName?.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <Controller
                    name="content"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        placeholder="Write a comment..."
                        rows={3}
                        className="w-full dark:placeholder-background/30 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      />
                    )}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSubmit(onSubmitComment)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/70 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      <span>Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 pb-8 border-b border-gray-100 text-center">
              <p className="text-gray-600 mb-3">Please login to comment</p>
              <button
                onClick={() => router.push("/signin")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/70 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  id={`${comment._id}`}
                  className="flex gap-3"
                >
                  {comment.author?.profilePicUrl ? (
                    <img
                      src={comment.author.profilePicUrl}
                      alt={`${comment.author.firstName} ${comment.author.lastName}`}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary dark:to-heading flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {comment.author?.firstName?.charAt(0)}
                      {comment.author?.lastName?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-background/10 relative rounded-lg p-4">
                      {currentUser?.accountType == "admin" ||
                      currentUser?._id == comment.author?._id ? (
                        <div className="absolute right-4 bottom-2">
                          <DeleteAlert
                            handleDelete={() =>
                              handleDeleteComment(comment._id)
                            }
                            title={"Delete this comment ?"}
                            deleteLoading={commentLoading}
                          />
                        </div>
                      ) : null}

                      <div className="flex items-baseline justify-between mb-1">
                        <p className="font-semibold text-gray-900 dark:text-background">
                          {comment.author?.firstName} {comment.author?.lastName}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-paragraph">
                          {formatTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-paragraph">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
