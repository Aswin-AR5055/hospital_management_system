import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="page-shell">
      <div className="page-content max-w-3xl">
        <section className="panel text-center">
          <p className="eyebrow">Access Control</p>
          <h1 className="page-title mt-4">You do not have permission to view this page.</h1>
          <p className="page-copy mx-auto mt-4">
            Sign in with an account that has the correct role for this route.
          </p>
          <div className="actions mt-6 justify-center">
            <Link className="btn-primary" to="/">
              Back to Login
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
