const router = require('express').Router();

router.get('/', (req, res) => res.json({ message: 'payments route ok' }));

module.exports = router;