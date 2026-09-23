import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, maxStars = 5, size = 16, interactive = false, onRatingChange = null }) {
  const currentRating = Math.round(Number(rating) || 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxStars)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= currentRating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          >
            <Star
              size={size}
              className={`${
                isFilled ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
}
