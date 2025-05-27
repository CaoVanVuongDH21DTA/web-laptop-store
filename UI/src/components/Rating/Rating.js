import React, { useMemo } from 'react'
import SvgStarIcon from '../common/SvgStarIcon';
import { SvgEmptyStar } from '../common/SvgEmptyStar';

const Rating = ({ rating }) => {
  // Chuyển rating thành số nguyên từ 0 đến 5
  const validRating = Math.min(5, Math.max(0, Math.floor(Number(rating) || 0)));

  const ratingNumber = useMemo(() => {
    return new Array(validRating).fill();
  }, [validRating]);

  const emptyStarsCount = 5 - validRating;

  return (
    <div className="flex items-center">
      {ratingNumber.map((_, index) => (
        <SvgStarIcon key={index} />
      ))}
      {new Array(emptyStarsCount).fill().map((_, index) => (
        <SvgEmptyStar key={'empty-' + index} />
      ))}
      <p className="px-2 text-gray-500">{rating}</p>
    </div>
  );
};

export default Rating;
