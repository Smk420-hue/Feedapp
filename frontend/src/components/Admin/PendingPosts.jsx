import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import api from "../services/api";
import PostItem from "../Feed/PostItem";

const PendingPosts = () => {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingPosts = async () => {
      console.log("📡 Fetching pending posts...");
      try {
        const res = await api.get("api/admin/pending-posts");
        console.log("✅ Pending posts fetched:", res.data);
        setPendingPosts(res.data);
      } catch (err) {
        console.error("❌ Error fetching pending posts:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingPosts();
  }, []);

  const handleApprove = async (postId) => {
    console.log(`🟢 Approving post ID: ${postId}`);
    try {
      const res = await api.put(`api/admin/approve-post/${postId}`);
      console.log("✅ Post approved:", res.data);
      setPendingPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("❌ Error approving post:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (postId) => {
    console.log(`🗑️ Deleting post ID: ${postId}`);
    try {
      const res = await api.delete(`api/admin/delete-post/${postId}`);
      console.log("✅ Post deleted:", res.data);
      setPendingPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("❌ Error deleting post:", err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>
          Debug: Loading pending posts...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Pending Approval ({pendingPosts.length})
      </Typography>

      {pendingPosts.length === 0 ? (
        <Paper elevation={0} sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="body1">No posts pending approval</Typography>
          <Typography variant="caption" color="textSecondary">
            Debug: pendingPosts array is empty
          </Typography>
        </Paper>
      ) : (
        pendingPosts.map((post) => (
          <Paper key={post.id} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="caption" color="textSecondary">
              Debug: Post ID {post.id}, created by {post.createdByUsername || "Unknown"}
            </Typography>
            <PostItem post={post} />
            <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApprove(post.id)}
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </Button>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default PendingPosts;
