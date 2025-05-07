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
      try {
        const res = await api.get("/admin/pending-posts");
        setPendingPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingPosts();
  }, []);

  const handleApprove = async (postId) => {
    try {
      await api.put(`/admin/approve-post/${postId}`);
      setPendingPosts(pendingPosts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/admin/delete-post/${postId}`);
      setPendingPosts(pendingPosts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
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
        </Paper>
      ) : (
        pendingPosts.map((post) => (
          <Paper key={post.id} elevation={2} sx={{ p: 2, mb: 2 }}>
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
