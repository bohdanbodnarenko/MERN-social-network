const express = require('express'),
router = express.Router();

router.get('/test', (req, res) => res.json({
msg: 'Profile works!'
}));

module.exports = router;