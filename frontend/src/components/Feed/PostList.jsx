import React, { useState, useEffect, useContext } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import api from '../services/api';
import PostItem from './PostItem';
import CreatePost from './CreatePost';
import AuthContext from '../context/AuthContext';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const base_url = "http://localhost:5000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(`${base_url}/api/posts`);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async (content) => {
    try {
      const res = await api.post(`${base_url}/api/posts`, { content });
      setPosts([res.data, ...posts]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await api.delete(`${base_url}/api/posts/${postId}`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePost = async (post) => {
    try {
      const res = await api.put(`${base_url}/api/posts${post.id}`, { content: post.content });
      setPosts(posts.map(p => p.id === post.id ? res.data : p));
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
      {user && <CreatePost onCreate={handleCreatePost} />}
      {posts.length === 0 ? (
        <Typography variant="body1" align="center" mt={4}>
          No posts available
        </Typography>
      ) : (
        posts.map(post => (
          <PostItem
            key={post.id}
            post={post}
            onDelete={handleDeletePost}
            onUpdate={handleUpdatePost}
            isOwnPost={post.userId === user?.id}
          />
        ))
      )}
    </Box>
  );
};

export default PostList;