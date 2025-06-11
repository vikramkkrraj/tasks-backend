const rateLimit = require('express-rate-limit');

const limiter  = rateLimit({
    windowMs : 60 * 1000,
    limit: 5,
    message : "Too many request. Please try again later"
});

module.exports = limiter;