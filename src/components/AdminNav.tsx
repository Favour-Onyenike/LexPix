import { Link } from 'react-router-dom';

const AdminNav = () => {
  return (
    <nav className="flex gap-4 mb-8">
      <Link 
        to="/admin/featured-projects" 
        className="text-lg hover:text-primary transition-colors"
      >
        Featured Projects
      </Link>
      <Link 
        to="/admin/gallery" 
        className="text-lg hover:text-primary transition-colors"
      >
        Gallery
      </Link>
      <Link 
        to="/admin/events" 
        className="text-lg hover:text-primary transition-colors"
      >
        Events
      </Link>
      <Link 
        to="/admin/reviews" 
        className="text-lg hover:text-primary transition-colors"
      >
        Reviews
      </Link>
      <Link 
        to="/admin/team" 
        className="text-lg hover:text-primary transition-colors"
      >
        Team
      </Link>
    </nav>
  );
};

export default AdminNav;