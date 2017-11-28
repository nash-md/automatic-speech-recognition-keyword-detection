# Twilio Automatic Speech Recognition Intent Detection

![Twilio Automatic Speech Recognition](twilio_asr_example.png)

This application demonstrates Twilio automatic speech recognition with a voice call. With speech recognition you can detect the intent of a phone call quickly in real-time.

## Installation

This project requires [Node.js](http://nodejs.org/) 6 or greater.

### Twilio Setup

You don't have a Twilio Account yet? Sign up on https://www.twilio.com/try-twilio and create one. You need a Twilio phone number for this demo.

This application is provided as-is. Twilio does not officially support it.

## One Click Install - Heroku

This will install the application and all the dependencies on Heroku (login required) for you. As part of the installation, the Heroku app will walk you through configuration of environment variables. Please click on the following button to deploy the application.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nash-md/automatic-speech-recognition-keyword-detection)


## Manual Install - On Your Own Server

Fork and clone the repository. Then, install dependencies with:

```bash
npm install
```

Make sure you have the following environment variables set:

- `TWILIO_API_KEY_SID`
- `TWILIO_API_KEY_SECRET`
- `TWILIO_ACCOUNT_SID`

You can create your Twilio API Keys [here](https://www.twilio.com/console/voice/dev-tools/api-keys/). 

The application will push speech-to-text result in real-time to your browser. This feature requires Twilio Sync an API for maintaining state across multiple devices. 

Please go to [Twilio Sync](https://www.twilio.com/console/sync/services/), create a Service and set the environment variable `TWILIO_SYNC_SERVICE_SID` with the newly created Service identifier.

The application will make outbound phone calls to a phone number. Buy a new Twilio phone number or use a number you already have and set the environment variable `TWILIO_PHONE_NUMBER` with the value of your phone number.

Start the server

```bash
node app.js
```

### Run the Demo

After the installation has completed please open `https://<your_application_name>/` in a web browser. You can now add keyword to the list which are later uses for the real-time speech intent detection. Select a language for the speech recognition and set a phone number you want to call. 

Please check that you have suffient balance and you set [Voice Geographic Permissions](https://www.twilio.com/console/voice/settings/geo-permissions) to allow your Twilio account to call this phone number. When you pick up the phone Twilio ASR will detect the voice and convert the audio signal into text. The text content is pushed to the browser and if a matching word from the keyword list is found it is highlighted.

## Questions?

Message [mdamm@twilio.com](mailto:mdamm@twilio.com) 

## License

MIT
	
## Contributors
	
- Matthias Damm <mdamm@twilio.com>
