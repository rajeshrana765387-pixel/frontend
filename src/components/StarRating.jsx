import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating, onRate, readonly = false, size = 'md' }) => {
  const stars = [1, 2, 3, 4, 5];
  const fontSize = size === 'lg' ? '1.75rem' : size === 'sm' ? '1rem' : '1.25rem';

  return (
    <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onRate && onRate(star)}
          style={{
            fontSize,
            cursor: readonly ? 'default' : 'pointer',
            color: star <= (rating || 0) ? '#f59e0b' : '#cbd5e1',
            transition: 'color 0.1s, transform 0.1s',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            if (!readonly) e.target.style.transform = 'scale(1.2)';
          }}
          onMouseLeave={(e) => {
            if (!readonly) e.target.style.transform = 'scale(1)';
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
