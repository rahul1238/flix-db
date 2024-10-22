import React, { useState, useEffect } from 'react';
import {Box,Button,Typography,Snackbar,CircularProgress,Dialog,DialogTitle,DialogContent,DialogActions,TextField,Rating,IconButton,Avatar} from '@mui/material';
import { ThumbUp, ChatBubbleOutline } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';

interface UserType {
  id: number;
  username: string;
  avatar: string;
}

interface ReviewType {
  id: number;
  movieId: number;
  userId: number;
  rating: number;
  headline: string;
  feedback: string;
  createdAt: string;
  user: UserType;
}

interface ReviewProps {
  movieId: number;
}

const Review: React.FC<ReviewProps> = ({ movieId }) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openReviewDialog, setOpenReviewDialog] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState<string>('');
  const [reviewHeadline, setReviewHeadline] = useState<string>('');

  const { user } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/reviews/${movieId}`);
        setReviews(response.data.data);
      } catch (error) {
        setErrorMessage('Failed to fetch reviews. Please try again later.');
        console.error(`Error fetching reviews for movie ${movieId}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId]);

  const handleSnackbarClose = () => {
    setErrorMessage(null);
  };

  const handleOpenReviewDialog = () => {
    setReviewRating(null);
    setReviewFeedback('');
    setReviewHeadline('');
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
  };

  const handleSubmitReview = async () => {
    if (!reviewRating || !reviewFeedback.trim() || !reviewHeadline.trim()) {
      setErrorMessage('Please provide a rating, headline, and comment.');
      return;
    }

    if (!user) {
      setErrorMessage('You must be logged in to submit a review.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/reviews`,
        {
          movieId: movieId,
          headline: reviewHeadline,
          rating: reviewRating,
          feedback: reviewFeedback,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );

      setReviews((prevReviews) => [...prevReviews, response.data.data]);
      setOpenReviewDialog(false);
    } catch (error) {
      setErrorMessage('Failed to submit review. Please try again.');
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Reviews</Typography>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Box key={review.id} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Avatar and username */}
                <Avatar src={review.user.avatar} alt={review.user.username} sx={{ mr: 2 }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {review.user.username || 'Anonymous'}
                </Typography>
              </Box>
              <Rating value={review.rating} readOnly size="small" />
            </Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              {new Date(review.createdAt).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {review.feedback}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton size="small">
                <ThumbUp fontSize="small" /> 1
              </IconButton>
              <IconButton size="small">
                <ChatBubbleOutline fontSize="small" /> 2
              </IconButton>
            </Box>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No reviews yet.
        </Typography>
      )}
      <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={handleOpenReviewDialog}>
        Add Review
      </Button>

      {/* Review Dialog */}
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Rating
              name="review-rating"
              value={reviewRating}
              onChange={(event, newValue) => {
                setReviewRating(newValue);
              }}
            />
            <TextField
              label="Headline"
              value={reviewHeadline}
              onChange={(e) => setReviewHeadline(e.target.value)}
              variant="outlined"
              required
            />
            <TextField
              label="Comment"
              multiline
              rows={4}
              value={reviewFeedback}
              onChange={(e) => setReviewFeedback(e.target.value)}
              variant="outlined"
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmitReview}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={errorMessage}
      />
    </Box>
  );
};

export default Review;
