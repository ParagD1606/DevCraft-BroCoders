const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const crypto = require('crypto');

// We'll need to access the users map from authRoutes. 
// In a real app, this would be a database model.
// For now, we'll export a function that accepts the users map or handles user creation.
// Since authRoutes.js has the usersByEmail map locally, we might need to refactor slightly 
// or just handle the user find/create logic here if we can export/import the map.
// However, to keep it simple and avoid circular dependencies without a DB, 
// let's define the strategy but handle the user logic in the callback.

const GOOGLE_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

passport.use(
    new GitHubStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:5000/api/auth/github/callback',
            scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // We will handle user creation/lookup in the route handler or here.
                // Passport standard is to do it here.
                // Since we don't have direct access to 'usersByEmail' from authRoutes here easily without circular deps 
                // (unless we move usersByEmail to a shared module), we'll pass the profile on.
                return done(null, profile);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;
