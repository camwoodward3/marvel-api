const router = require('express').Router();
const passport = require('passport');

router.get('/google',

  // Something to get token out of body
  // Verify there's a token and call the middlware function to make sure the Google user is valid
  // Go to user database and using mongodb and make sure that user exists.
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/'
  }),
  (req, res) => {
    res.redirect('/api/characters');
  }
);

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

module.exports = router;
