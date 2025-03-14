export const ErrorPage = () => {
  return (
    <div className="error-container">
      <h1 className="text-9xl font-extrabold text-white mb-4 animate-bounce">
        404
      </h1>
      <p className="text-2xl text-white mb-2">Page Not Found</p>
      <p className="text-lg text-white mb-8">
        We couldn’t find the page you’re looking for.
      </p>
      <a href="/" className="error-link">
        Go Home
      </a>
    </div>
  );
};
