const twilio = require('twilio');

const AccessToken = twilio.jwt.AccessToken;
const SyncGrant = AccessToken.SyncGrant;

const client = new twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET, 
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID
  });

module.exports.create = function (req, res) {
  const lifetime = 1800;

  // create a unique ID for the client on their current device
  const endpointId = `TwilioASRDemo::${req.body.identity}`;

  const accessToken = new AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET,
    { ttl: lifetime });

  /* create token for Twilio Sync    */
  const syncGrant = new SyncGrant({
    serviceSid: process.env.TWILIO_SYNC_SERVICE_SID,
    endpointId: endpointId,
  });

  accessToken.addGrant(syncGrant);
  accessToken.identity = req.body.identity;

  /* create a new document */
  const payload = {
    uniqueName: req.body.identity,
    data: { text: null, call: { sid: null, to: null, status: null } },
  };

  const service = client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID);

  service.documents
    .create(payload)
    .then((doc) => {
      res.json({ token: accessToken.toJwt(), sid: doc.sid });
    }).catch((error) => {
      console.log(error);
      res.status(500).json(error);
    });
};
