const twilio = require('twilio');
const utilRemoteSync = require('.././util-remote-sync.js');

const client = new twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET, 
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID
  });

module.exports.partialResult = function (req, res) {
  utilRemoteSync
    .update(req.params.identity, { text: req.body.UnstableSpeechResult })
    .then((doc) => {
      res.status(200).end();
    }).catch((error) => {
      res.status(500).end();
    });
};

module.exports.voice = function (req, res) {
  const service = client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID);

  const twiml = new twilio.twiml.VoiceResponse();

  service
    .documents(req.params.identity)
    .fetch()
    .then((response) => {
      const requestUrl = `${req.protocol}://${req.hostname}/api/call/${req.params.identity}/partial-result`;

      const gather = twiml.gather({
        input: 'speech',
        timeout: 30,
        partialResultCallback: requestUrl,
        partialResultCallbackMethod: 'POST',
        language: response.data.language,
        hints: response.data.labels,
      });
      gather.say('Thanks for calling us, how can we help you?');

      twiml.hangup();

      console.log('TwiML: ' + twiml.toString());

      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=0');
      res.send(twiml.toString());
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports.initiate = function (req, res) {
  const service = client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID);

  const requestUrl = `${req.protocol}://${req.hostname}/api/call/${req.body.identity}/voice`;
  const statusCallbackUrl = `${req.protocol}://${req.hostname}/api/call/${req.body.identity}/status-callback`;

  client.calls.create({
      url: requestUrl,
      to: req.body.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      statusCallback: statusCallbackUrl,
      statusCallbackMethod: 'POST',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    }).then((call) => {
      return service.documents(req.body.identity)
        .update({
          data: {
            labels: req.body.labels,
            language: req.body.language,
            call: { sid: call.sid, to: call.to, status: null },
          },
        });
    }).then((document) => {
      res.status(200).json({ sid: document.data.call.sid });
    }).catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};

module.exports.statusCallback = function (req, res) {
  console.log(`Call - Status Callback: ${req.body.CallSid} status: ${req.body.CallStatus}`);

  const service = client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID);

  service.documents(req.params.identity).fetch()
    .then((response) => {
      const data = response.data;

      if (req.body.CallStatus === 'completed') {
        data.call = { sid: null, to: '', status: '' };
      } else {
        data.call.status = req.body.CallStatus;
      }

      return data;
    }).then((data) => {
      return service.documents(req.params.identity)
      .update({
        data: data,
      });
    }).then((doc) => {
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).end();
    }).catch((error) => {
      console.log(error);
      res.setHeader('Content-Type', 'application/xml');
      res.status(500).json(error);
    });
};
