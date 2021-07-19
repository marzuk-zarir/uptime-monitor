# Uptime Monitoring API

This application monitor url (check). User can set their own check with http success status code. Application sent request to user's check in every 3 seconds. If user's provided success status code is not match with response status code, url state is down. If match url state is up. Every state change for each check will notify to the user with via SMS.

- [Uptime Monitoring API](#uptime-monitoring-api)
  - [User Terms & Conditions:](#user-terms--conditions)
  - [How to run](#how-to-run)
  - [Technology](#technology)
  - [Contact](#contact)

## User Terms & Conditions:

1. Every user can create maximum **6** checks
2. User should provide their **mobile number** for state change alert SMS
3. User should provided their token for **Sign in**. Only Signed in user can create checks
4. Token is invalid in **60 minutes** after creation time

## How to run

1. Clone the repository

```
git clone https://github.com/marzuk-zarir/uptime-monitoring-api.git
```

2. Install dependencies

```
npm install
```

3. Paste this JavaScript object with secret in [env.js](./.env/env.js) file under env.development & env.production object

```js
twilio: {
    fromPhone: 'YOUR_PHONE_NUMBER',
    accountSid: 'TWILIO_ACCOUNT_SID',
    authToken: 'TWILIO_ACCOUNT_TOKEN'
}
```

4. Remove .gitkeep

```
rm -f user/.gitkeep && rm -f token/.gitkeep && rm -f check/.gitkeep
```

5. Run the app in development mode

```
npm start
```

6. Your app is start in http://localhost:3000

## Technology

-   [Nodejs](https://nodejs.org)
-   [Twilio Api](https://www.twilio.com/)
-   [Chalk](https://www.npmjs.com/package/chalk)

## Contact

Marzuk Zarir - business.marzukzarir@gmail.com
