var express = require('express');
var router = express.Router();

var eventContainer = {};

const SDP = 'SDP',
	ICE = 'ICE';

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

router.get('/a', function(req, res, next) {
	res.render('a', {
		title: 'Express'
	});
});

router.get('/b', function(req, res, next) {
	res.render('b', {
		title: 'Express'
	});
});

router.get('/json', function(req, res, next) {
	res.json({
		'res': 1
	});
});

router.post('/postTest', function(req, res, next) {
	res.json({
		'res': req.body
	});
});

router.post('/rtc/event', function(req, res, next) {
	var to = req.body.to,
		from = req.body.from,
		event = req.body.event,
		id = req.body.id,
		data = req.body.data;

	!eventContainer[to] && (eventContainer[to] = {});
	!eventContainer[to][from] && (eventContainer[to][from] = {});
	switch (event) {
		case SDP:
			eventContainer[to][from][event] = {
				data: data,
				id: id,
				from: from
			};
			break;
		case ICE:
		default:
			!eventContainer[to][from][event] && (eventContainer[to][from][event] = []);
			eventContainer[to][from][event].push({
				data: data,
				id: id,
				from: from
			});
			break;
	}
	res.json({
		'res': 1
	});
});

router.get('/rtc/:number/event/:event', function(req, res, next) {
	var events = [],
		list = eventContainer[req.param('number')];
	for (var from in list) {
		if (list.hasOwnProperty(from) && list[from][req.param('event')]) {
			events.push(list[from][req.param('event')]);
			// delete list[from][req.param('event')];
		}
	}
	res.json({
		'res': 1,
		data: events
	});
});

module.exports = router;