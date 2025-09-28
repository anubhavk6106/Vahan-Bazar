import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, User, Calendar } from 'lucide-react';

const Reviews = ({ vehicleId, reviews = [], onAddReview }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [allReviews, setAllReviews] = useState([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    review: '',
    pros: '',
    cons: '',
    ownershipDuration: '',
    purchasePrice: '',
    fuelEfficiency: '',
    recommend: true
  });

  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  // Realistic reviews for vehicle marketplace
  const mockReviews = [
    {
      id: 1,
      userName: 'Rajesh Kumar',
      userImage: null,
      rating: 4.5,
      title: 'Excellent fuel efficiency and build quality',
      review: 'I have been using this Honda CB Hornet 2.0 for over a year now and it has been fantastic. The fuel efficiency is excellent at around 45 kmpl in city conditions. The build quality is solid and maintenance costs are reasonable. The ABS works well and gives confidence while braking. Overall a very reliable bike for daily commuting.',
      pros: 'Excellent fuel efficiency, reliable Honda engine, good build quality, comfortable riding position',
      cons: 'Could have more power for highway riding, seat could be more comfortable for long rides',
      ownershipDuration: '1 year 4 months',
      purchasePrice: '125000',
      fuelEfficiency: '45 kmpl',
      recommend: true,
      helpful: 34,
      notHelpful: 3,
      date: '2024-01-15',
      verified: true
    },
    {
      id: 2,
      userName: 'Priya Sharma',
      userImage: null,
      rating: 5,
      title: 'Perfect bike for daily office commute',
      review: 'This bike is perfect for my daily office commute in Mumbai traffic. Very smooth ride and easy to handle. The digital display is clear and informative. Service network is excellent with Honda service centers available everywhere. Highly recommended for first-time buyers.',
      pros: 'Smooth ride, easy handling, excellent service network, fuel efficient',
      cons: 'Storage space could be better, no mobile charging port',
      ownershipDuration: '10 months',
      purchasePrice: '123000',
      fuelEfficiency: '47 kmpl',
      recommend: true,
      helpful: 28,
      notHelpful: 1,
      date: '2024-02-20',
      verified: true
    },
    {
      id: 3,
      userName: 'Amit Singh',
      userImage: null,
      rating: 4,
      title: 'Good value for money, some minor issues',
      review: 'Overall a good bike for the price. The engine is refined and fuel efficiency is as promised. However, I faced some minor issues with the headlight alignment and had to get it adjusted twice. The ride quality is comfortable for city riding.',
      pros: 'Good value for money, refined engine, comfortable ride',
      cons: 'Minor quality issues, headlight alignment problems',
      ownershipDuration: '6 months',
      purchasePrice: '127000',
      fuelEfficiency: '43 kmpl',
      recommend: true,
      helpful: 15,
      notHelpful: 4,
      date: '2024-03-10',
      verified: true
    },
    {
      id: 4,
      userName: 'Sneha Patel',
      userImage: null,
      rating: 4.5,
      title: 'Great for women riders',
      review: 'As a woman rider, I find this bike very comfortable and easy to handle. The seat height is perfect and the bike feels balanced. The LED headlight provides good visibility during night rides. Honda\'s reliability is clearly visible in this model.',
      pros: 'Perfect seat height, easy to handle, reliable brand, good night visibility',
      cons: 'Could have better pillion comfort, lacks USB charging',
      ownershipDuration: '8 months',
      purchasePrice: '124000',
      fuelEfficiency: '46 kmpl',
      recommend: true,
      helpful: 22,
      notHelpful: 2,
      date: '2024-02-28',
      verified: true
    },
    {
      id: 5,
      userName: 'Vikram Joshi',
      userImage: null,
      rating: 3.5,
      title: 'Average performance, expected more',
      review: 'The bike is okay for city riding but I expected more performance for the price. The pickup is decent but not great. Fuel efficiency is good as advertised. Build quality is solid as expected from Honda. Service costs are reasonable.',
      pros: 'Good fuel efficiency, solid build quality, reasonable service costs',
      cons: 'Average pickup, lacks excitement, could be more feature-rich',
      ownershipDuration: '4 months',
      purchasePrice: '128000',
      fuelEfficiency: '44 kmpl',
      recommend: false,
      helpful: 12,
      notHelpful: 8,
      date: '2024-03-25',
      verified: true
    }
  ];

  // Initialize reviews on component mount (only once)
  useEffect(() => {
    setAllReviews(reviews.length > 0 ? reviews : mockReviews);
  }, []); // Empty dependency array - only run once

  // Filter and sort reviews
  const filteredReviews = allReviews.filter(review => {
    if (filterRating === 'all') return true;
    return Math.floor(review.rating) === parseInt(filterRating);
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date);
      case 'oldest':
        return new Date(a.date) - new Date(b.date);
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const displayReviews = sortedReviews;

  const totalReviews = displayReviews.length;
  const averageRating = totalReviews > 0 ? displayReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: displayReviews.filter(review => Math.floor(review.rating) === rating).length,
    percentage: (displayReviews.filter(review => Math.floor(review.rating) === rating).length / totalReviews) * 100
  }));

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    const reviewData = {
      ...newReview,
      id: Date.now(),
      userName: 'Current User', // Would come from auth context
      date: new Date().toISOString().split('T')[0],
      helpful: 0,
      notHelpful: 0,
      verified: false
    };
    
    // Add review to local state
    setAllReviews(prev => [reviewData, ...prev]);
    
    // Call parent callback if provided
    if (onAddReview) {
      onAddReview(reviewData);
    }
    
    // Reset form
    setNewReview({
      rating: 5,
      title: '',
      review: '',
      pros: '',
      cons: '',
      ownershipDuration: '',
      purchasePrice: '',
      fuelEfficiency: '',
      recommend: true
    });
    setShowReviewForm(false);
    setShowSuccessMessage(true);
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleHelpfulVote = (reviewId, type) => {
    setAllReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          [type]: review[type] + 1
        };
      }
      return review;
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StarRating = ({ rating, size = 'h-4 w-4' }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`${size} ${
            star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const InteractiveStarRating = ({ rating, onRatingChange }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400 hover:fill-yellow-500'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="card p-4 bg-green-50 border-green-200">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <span className="text-green-800 font-medium">
              Review submitted successfully! Thank you for your feedback.
            </span>
          </div>
        </div>
      )}
      {/* Rating Overview */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={averageRating} size="h-5 w-5" />
            <div className="text-sm text-gray-600 mt-1">
              Based on {totalReviews} reviews
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center space-x-2 text-sm">
                <span className="w-3 text-gray-600">{rating}</span>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-gray-600 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowReviewForm(true)}
            className="btn-primary"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Write a Review
          </button>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="form-select text-sm"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayReviews.map(review => (
          <div key={review.id} className="card p-6">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {review.userImage ? (
                    <img
                      src={review.userImage}
                      alt={review.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                    {review.verified && (
                      <span className="badge-green text-xs">Verified</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-gray-600">
                      {formatDate(review.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-900">{review.title}</h5>
              <p className="text-gray-700 leading-relaxed">{review.review}</p>

              {/* Pros and Cons */}
              {(review.pros || review.cons) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {review.pros && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <h6 className="font-medium text-green-800 mb-1">Pros</h6>
                      <p className="text-sm text-green-700">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <h6 className="font-medium text-red-800 mb-1">Cons</h6>
                      <p className="text-sm text-red-700">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-gray-200 text-sm text-gray-600">
                {review.ownershipDuration && (
                  <div>
                    <span className="font-medium">Ownership:</span> {review.ownershipDuration}
                  </div>
                )}
                {review.purchasePrice && (
                  <div>
                    <span className="font-medium">Purchase Price:</span> ₹{parseInt(review.purchasePrice).toLocaleString()}
                  </div>
                )}
                {review.fuelEfficiency && (
                  <div>
                    <span className="font-medium">Fuel Efficiency:</span> {review.fuelEfficiency}
                  </div>
                )}
              </div>

              {/* Helpful Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleHelpfulVote(review.id, 'helpful')}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button 
                    onClick={() => handleHelpfulVote(review.id, 'notHelpful')}
                    className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>Not Helpful ({review.notHelpful})</span>
                  </button>
                </div>
                {review.recommend && (
                  <span className="text-sm text-green-600 font-medium">
                    ✓ Recommends this vehicle
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
              
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="form-label">Overall Rating</label>
                  <InteractiveStarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                  />
                </div>

                <div>
                  <label className="form-label">Review Title</label>
                  <input
                    type="text"
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    className="form-input"
                    placeholder="Summarize your experience"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Detailed Review</label>
                  <textarea
                    value={newReview.review}
                    onChange={(e) => setNewReview(prev => ({ ...prev, review: e.target.value }))}
                    className="form-textarea"
                    rows="4"
                    placeholder="Share your detailed experience with this vehicle"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">What did you like?</label>
                    <textarea
                      value={newReview.pros}
                      onChange={(e) => setNewReview(prev => ({ ...prev, pros: e.target.value }))}
                      className="form-textarea"
                      rows="2"
                      placeholder="Positive aspects..."
                    />
                  </div>

                  <div>
                    <label className="form-label">What could be improved?</label>
                    <textarea
                      value={newReview.cons}
                      onChange={(e) => setNewReview(prev => ({ ...prev, cons: e.target.value }))}
                      className="form-textarea"
                      rows="2"
                      placeholder="Areas for improvement..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Ownership Duration</label>
                    <input
                      type="text"
                      value={newReview.ownershipDuration}
                      onChange={(e) => setNewReview(prev => ({ ...prev, ownershipDuration: e.target.value }))}
                      className="form-input"
                      placeholder="e.g., 1 year 6 months"
                    />
                  </div>

                  <div>
                    <label className="form-label">Purchase Price (₹)</label>
                    <input
                      type="number"
                      value={newReview.purchasePrice}
                      onChange={(e) => setNewReview(prev => ({ ...prev, purchasePrice: e.target.value }))}
                      className="form-input"
                      placeholder="85000"
                    />
                  </div>

                  <div>
                    <label className="form-label">Fuel Efficiency</label>
                    <input
                      type="text"
                      value={newReview.fuelEfficiency}
                      onChange={(e) => setNewReview(prev => ({ ...prev, fuelEfficiency: e.target.value }))}
                      className="form-input"
                      placeholder="45 kmpl"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recommend"
                    checked={newReview.recommend}
                    onChange={(e) => setNewReview(prev => ({ ...prev, recommend: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="recommend" className="text-gray-700">
                    I would recommend this vehicle to others
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;