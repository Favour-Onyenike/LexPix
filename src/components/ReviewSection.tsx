import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { getPublishedReviews, submitReview, type Review } from '@/services/reviewService';
import { toast } from 'sonner';

// This component will be updated to use Supabase after connecting
const ReviewSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const loadReviews = async () => {
    const data = await getPublishedReviews(4);
    setReviews(data);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await submitReview({
        name,
        email,
        rating,
        text: review
      });
      
      if (result) {
        toast.success('Thank you for your review! It will be visible after approval.');
        // Reset form
        setName('');
        setEmail('');
        setRating(0);
        setReview('');
        // Refresh the reviews list
        await loadReviews();
      }
    } catch (error) {
      console.error('Review submission error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to submit review. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold mb-6 text-center"
        >
          Recent Feedbacks
        </motion.h2>
        <div className="w-16 h-1 bg-yellow-400 mx-auto mb-12"></div>
        
        {/* Reviews Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-black border border-gray-800 p-6 rounded-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{review.name}</h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 mb-2">{review.text}</p>
              <span className="text-xs text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </motion.div>
          ))}
          {reviews.length === 0 && (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-400">No reviews yet. Be the first to leave a review!</p>
            </div>
          )}
        </div>
        
        {/* Add Review Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Remove "What Our Clients Say" section in desktop mode */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Add a Review</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border bg-transparent border-gray-700 rounded-md p-4 h-14 text-white focus:border-yellow-400 focus:ring-0 w-full"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border bg-transparent border-gray-700 rounded-md p-4 h-14 text-white focus:border-yellow-400 focus:ring-0 w-full"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <div className="flex space-x-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none"
                        disabled={isSubmitting}
                      >
                        <Star
                          size={24}
                          className={
                            (hoveredRating ? star <= hoveredRating : star <= rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-500"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Textarea
                    placeholder="Write Your Review"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="border bg-transparent border-gray-700 rounded-md p-4 min-h-[150px] text-white focus:border-yellow-400 focus:ring-0 w-full"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium h-12"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
