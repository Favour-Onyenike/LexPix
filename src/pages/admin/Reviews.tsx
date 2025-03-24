
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { getAllReviews, deleteReview } from '@/services/reviewService';
import { Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      const allReviews = await getAllReviews();
      setReviews(allReviews);
    };
    loadReviews();
  }, []);

  const handleDelete = async (id: string) => {
    const success = await deleteReview(id);
    if (success) {
      setReviews(reviews.filter(review => review.id !== id));
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Review Management</h1>
      <div className="grid gap-4">
        {reviews.map((review: any) => (
          <div key={review.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{review.name}</h3>
                <p className="text-sm text-gray-500">{review.email}</p>
                <div className="flex items-center mt-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mt-2">{review.text}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(review.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
