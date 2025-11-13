"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import DeleteAlert from "@/app/components/DeleteAlert";
import { Eye, Search } from "lucide-react";
import Link from "next/link";

export default function UserPostsPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  let filtered = [...posts];

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter((post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  const handleDeletePost = async (postId) => {
    setDeleteLoading(true);
    try {
      await api.post(`/blog/post/delete/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error("Error fetching post:", err);
    } finally {
      setDeleteLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    try {
      const res = await api.get("/blog/user/posts");
      setPosts(res.data.userPosts || []);
    } catch (err) {
      console.error("Error fetching user posts:", err);

      setError(true);
    }
  };
  if (error)
    return <div className="p-6 text-red-500">Failed to load posts.</div>;

  return (
    <div className="p-6">
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <>
          <div className="flex-grow relative mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
            <input
              type="text"
              placeholder="Search posts by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <ul className="space-y-2">
            {filtered.map((post) => (
              <li
                key={post._id}
                className="p-3 rounded-lg border bg-gray-100 flex items-center justify-between"
              >
                <span>{post.title}</span>
                <Link
                  href={`/blog/${post._id}`}
                  className="text-primary ms-auto rounded-lg hover:bg-black/10 p-2 transition-colors"
                >
                  <Eye />
                </Link>
                <DeleteAlert
                  handleDelete={() => {
                    handleDeletePost(post._id);
                  }}
                  deleteLoading={deleteLoading}
                  title={"Delete this post?"}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
