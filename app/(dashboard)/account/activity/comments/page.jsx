"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import DeleteAlert from "@/app/components/DeleteAlert";
import { Eye, Search } from "lucide-react";
import Link from "next/link";

export default function UserCommentsPage() {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  let filtered = [...comments];

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter((comment) =>
      comment.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  const handleDeleteComment = async (commentId) => {
    setDeleteLoading(true);

    try {
      await api.post(`/blog/comment/delete/${commentId}`);
      fetchComments();
    } catch (error) {
      console.error("Error fetching post:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);
  const fetchComments = async () => {
    try {
      const res = await api.get("/blog/user/comments");
      setComments(res.data.userComments || []);
    } catch (err) {
      console.error("Error fetching user comments:", err);

      setError(true);
    }
  };
  if (error)
    return <div className="p-6 text-red-500">Failed to load comments.</div>;

  return (
    <div className="p-6">
      {comments.length === 0 ? (
        <p>No Comments yet.</p>
      ) : (
        <>
          <div className="flex-grow relative mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-paragraph w-5 h-5" />
            <input
              type="text"
              placeholder="Search comments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <ul className="space-y-2">
            {filtered.map((comment) => (
              <li
                key={comment._id}
                className="p-3 rounded-lg border bg-gray-100 flex items-center justify-between"
              >
                <span>
                  {comment.content.slice(0, 32)}
                  {comment.content.length > 32 ? "..." : null}
                </span>
                <Link
                  href={`/blog/${comment.post}`}
                  className="text-primary ms-auto rounded-lg hover:bg-black/10 p-2 transition-colors"
                >
                  <Eye />
                </Link>
                <DeleteAlert
                  handleDelete={() => {
                    handleDeleteComment(comment._id);
                  }}
                  deleteLoading={deleteLoading}
                  title={"Delete this comment?"}
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
