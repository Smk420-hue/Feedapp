import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  CircularProgress 
} from '@mui/material';
import api from '../services/api';

const base_url = "http://localhost:5000";


const CreatePost = ({ onCreate }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post(`${base_url}/api/posts`, { content });
      onCreate(res.data);
      setContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="What's on your mind?"
          multiline
          rows={3}
          fullWidth
          variant="outlined"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={!content.trim() || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Post'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CreatePost;