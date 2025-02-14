import { Button } from "@carbon/react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="mt-32 flex flex-col gap-6">
      <h1>Page Not Found</h1>
      <p>The page you’re looking for doesn’t exist or has been moved.</p>
      <Link to="/">
        <Button kind="primary">Go to Homepage</Button>
      </Link>
    </div>
  );
};

export default NotFound;
