import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, CalendarDays, Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getGalleryImages } from '@/services/galleryService';
import { getEvents } from '@/services/eventService';
import { getAllReviews } from '@/services/reviewService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalImages: 0,
    totalEvents: 0,
    totalReviews: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [images, events, reviews] = await Promise.all([
          getGalleryImages(),
          getEvents(),
          getAllReviews()
        ]);
        
        setStats({
          totalImages: images.length,
          totalEvents: events.length,
          totalReviews: reviews.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your photography admin panel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Gallery</CardTitle>
                  <CardDescription>Manage your photo gallery</CardDescription>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Image size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 mb-4">
                  <div className="text-2xl font-semibold">{stats.totalImages}</div>
                  <p className="text-xs text-muted-foreground">Total images</p>
                </div>
                <Button asChild>
                  <Link to="/admin/gallery">
                    <Plus size={16} className="mr-2" />
                    Add Images
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Events</CardTitle>
                  <CardDescription>Manage client event galleries</CardDescription>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <CalendarDays size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 mb-4">
                  <div className="text-2xl font-semibold">{stats.totalEvents}</div>
                  <p className="text-xs text-muted-foreground">Total events</p>
                </div>
                <Button asChild>
                  <Link to="/admin/events">
                    <Plus size={16} className="mr-2" />
                    Create Event
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <CardTitle>Reviews</CardTitle>
                  <CardDescription>Manage customer reviews</CardDescription>
                </div>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Star size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2 mb-4">
                  <div className="text-2xl font-semibold">{stats.totalReviews}</div>
                  <p className="text-xs text-muted-foreground">Total reviews</p>
                </div>
                <Button asChild>
                  <Link to="/admin/reviews">
                    <Plus size={16} className="mr-2" />
                    Manage Reviews
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured Projects Card */}
          <Link to="/admin/featured-projects">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Featured Projects</h2>
                <p className="text-gray-600 mb-4">Manage featured projects on the homepage</p>
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-gray-500">Featured Projects</div>
              </CardContent>
            </Card>
          </Link>

          {/* Team Management Card */}
          <Link to="/admin/team">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">Team Management</h2>
                <p className="text-gray-600 mb-4">Manage team members and invites</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Getting started with the admin panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-secondary p-4">
                <h3 className="text-sm font-medium mb-1">Gallery Management</h3>
                <p className="text-sm text-muted-foreground">
                  Upload images to your portfolio gallery to showcase your best work. These will be displayed to all visitors.
                </p>
              </div>
              
              <div className="rounded-md bg-secondary p-4">
                <h3 className="text-sm font-medium mb-1">Event Galleries</h3>
                <p className="text-sm text-muted-foreground">
                  Create event-specific galleries for your clients to view and download their photos. Perfect for weddings,
                  parties, and professional shoots.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
