import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-4">The page you're looking for doesn't exist.</p>
        <Link
          to="/dashboard"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};
