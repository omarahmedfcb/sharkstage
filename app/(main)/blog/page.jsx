"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import api from "@/lib/axios";
import { MessageSquare, Clock, Plus, X, Loader2, Trash2 } from "lucide-react";
import AddComment from "./AddComment";
import toast from "react-hot-toast";
import InputField from "@/app/components/InputField";
import Link from "next/link";

export default function BlogPage() {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blog");
      setPosts(res.data.allPosts || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const [open, setOpen] = useState(false);
  const onSubmitLogic = async (data) => {
    setPostLoading(true);
    try {
      const res = await api.post("/blog/post/add", data);
      setPosts([res.data.newPost, ...posts]);
      reset();
      handleClose();
      fetchPosts();

      toast.success("Post added successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add post");
    } finally {
      setPostLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else if (diffInHours < 168) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
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

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-32">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-background">
              Blog
            </h1>
            <p className="text-paragraph mt-1">Share your thoughts and ideas</p>
          </div>

          {isLoggedIn && (
            <>
              <button
                onClick={handleClickOpen}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/70 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Post</span>
              </button>
              <AddComment
                title={"Add a Post"}
                handleClickOpen={handleClickOpen}
                handleClose={handleClose}
                onSubmitLogic={onSubmitLogic}
                handleSubmit={handleSubmit}
                postLoading={postLoading}
                open={open}
              >
                <Controller
                  name="title"
                  control={control}
                  rules={{
                    required: "Title is required",
                  }}
                  render={({ field }) => (
                    <InputField
                      label="Post Title"
                      error={errors.title?.message}
                      required
                    >
                      <input
                        {...field}
                        type="text"
                        className="w-full dark:placeholder-background/30 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        placeholder="Title"
                      />
                    </InputField>
                  )}
                />
                <Controller
                  name="content"
                  control={control}
                  rules={{ required: "Content is required" }}
                  render={({ field }) => (
                    <InputField
                      label="Content"
                      error={errors.content?.message}
                      required
                    >
                      <textarea
                        {...field}
                        rows={5}
                        className="w-full dark:placeholder-background/30 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                        placeholder="Content"
                      />
                    </InputField>
                  )}
                />
              </AddComment>
            </>
          )}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white dark:bg-background-dark rounded-2xl p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h2>
              <p className="text-gray-500">
                {isLoggedIn
                  ? "Be the first to share something!"
                  : "Check back later for new posts"}
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post._id}`}
                className="bg-white dark:bg-background/10 rounded-2xl p-6 border border-gray-100 dark:border-0 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 block"
              >
                {/* Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  {post.author?.profilePicUrl ? (
                    <img
                      src={post.author.profilePicUrl}
                      alt={`${post.author.firstName} ${post.author.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary dark:to-heading flex items-center justify-center text-white font-semibold">
                      {post.author?.firstName?.charAt(0)}
                      {post.author?.lastName?.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-background">
                      {post.author?.firstName} {post.author?.lastName}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-paragraph">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(post.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-background mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-700 dark:text-paragraph mb-4 line-clamp-3">
                  {post.content}
                </p>

                {/* Engagement */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-gray-600 dark:text-paragraph">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Comments</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
