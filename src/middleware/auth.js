// Temporary middleware that simulates authentication
const mockAuthenticate = (req, res, next) => {
  // Hardcode a test user (remove this later)
  req.user = {
    id: 1, // or any test user ID that exists in your database
    email: 'test@example.com',
    role: 'interim_collaborator'
  };
  next();
};

module.exports = { mockAuthenticate };