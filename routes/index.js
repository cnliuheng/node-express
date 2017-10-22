var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '背景',
  		names: [{ name: '张英才', age: 28 },
		        { name: '刘恒', age: 26 },
		        { name: '唐爱华', age: 45 }
		       ],
        student:['张胜男','李爱女','王阴阳']
 			});
});
module.exports = router;
