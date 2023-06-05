/* poniższy przykład tworzy router jako moduł, 
 i montuje moduł routera na ścieżce w głównej aplikacji. */

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200).send('Strona główna z Router!');
});

module.exports = router;
