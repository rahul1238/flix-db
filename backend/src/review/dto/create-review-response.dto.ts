import { Review } from '../review.entity';

export interface CreateReviewResponseDto {
  success?: boolean;
  message?: string;
  review?: Review;
}