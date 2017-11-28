const twilio = require('twilio');

const client = new twilio(
  process.env.TWILIO_API_KEY_SID,
  process.env.TWILIO_API_KEY_SECRET, 
  {
    accountSid: process.env.TWILIO_ACCOUNT_SID
  });

const service = client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID);

const retrieveDocument = function (name) {
  console.log('Retrieve Remote Document: ' + name);

  return new Promise((resolve, reject) => {
    service.documents(name)
      .fetch()
      .then((doc) => {
        /* we could retrieve the document */
        resolve(doc);
      }).catch((error) => {
        /* create a new document */
        const payload = {
          uniqueName: name,
          data: null,
        };

        service.documents.create(payload)
          .then((doc) => {
            resolve(doc);
          }).catch((error) => {
            reject(error);
          });
      });
  });
};

module.exports.update = function (name, data) {
  const payload = {
    name: name,
    data: JSON.stringify(data),
  };

  return new Promise((resolve, reject) => {
    retrieveDocument(name)
      .then((doc) => {
        console.log('Remote Update: ' + name);
        client.sync.services(process.env.TWILIO_SYNC_SERVICE_SID)
          .documents(doc.sid)
          .update(payload)
          .then((doc) => {
            resolve(doc);
          });
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
};
