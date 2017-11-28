const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({
  extended: true,
}));

const router = express.Router();

const token = require('./controllers/token.js');

router.route('/token').post(token.create);

const call = require('./controllers/call.js');

router.route('/call').post(call.initiate);
router.route('/call/:identity/voice').post(call.voice);
router.route('/call/:identity/partial-result').post(call.partialResult);
router.route('/call/:identity/status-callback').post(call.statusCallback);

app.use('/api', router);
app.use('/', express.static(__dirname + '/public'));

app.listen(app.get('port'), () => {
  console.log('magic happens on port', app.get('port'));
});
