import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CardActions,
  Chip,
  Box
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

const PostItem = ({ post, onDelete, onUpdate, isOwnPost }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="subtitle2" color="text.secondary">
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
          <Chip 
            label={post.createdByUsername} 
            size="small" 
            color={isOwnPost ? 'primary' : 'default'}
          />
        </Box>
        <Typography variant="body1">{post.content}</Typography>
      </CardContent>
      {isOwnPost && (
        <CardActions>
          <Button 
            size="small" 
            startIcon={<Edit />}
            onClick={() => onUpdate(post)}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            startIcon={<Delete />}
            color="error"
            onClick={() => onDelete(post.id)}
          >
            Delete
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default PostItem;