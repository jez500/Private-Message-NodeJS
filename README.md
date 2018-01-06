# Private Message NodeJS

Instant updates and notifications for the [Private Message module](https://www.drupal.org/project/private_message)
module without the need for polling.

This listens for private message thread updates and uses the [drupal nodejs module](https://www.drupal.org/project/nodejs)
to trigger updates to the UI and provide notifications for members of the changed thread.

## How it normally works

Polling is the standard method of checking for message updates, this means a website will hit your server every
XX seconds to see if anything has changed. This is not ideal as it puts lots of extra load on your server with all
those requests, it also means a user will have to wait XX seconds for a reply. If polling is disabled, it would require
a full page reload!

## Why this is a huge improvement

* No polling slowing down your browser
* No unnecessary constant load on your server
* Message threads immediately show new messages
* In-page browser notifications when new messages are recieved (optional).

## Requirements

* [Private Message module](https://www.drupal.org/project/private_message)
* [drupal nodejs module](https://www.drupal.org/project/nodejs)

Not a requirement, but this module has been **specifically** made to work with
[Private Message Messenger](https://github.com/jez500/Private-Message-Messenger), if you are not using this, you will
have to implement your own integration (see below for hooking into a notification).

## Hooking into a notification

This module triggers an event on `$(window)` so all you have to do is listen to window for the event. Eg:

```
$(window).on('pm:threads:poll', function(event, data) {
  console.log(data);
  alert('New message from ' + data.ownerName);
});
```

## Installation

### 1. Add repo and install Private Message NodeJS with deps

Add the repo to your `composer.json`

```
    "repositories": [
        ...
        {
            "type": "git",
            "url": "https://github.com/jez500/Private-Message-NodeJS.git"
        }
    ],

```

Then...
`composer require drupal/private_message_nodejs`

And...
`drush en -y private_message_nodejs`

### 2. Ensure you have NodeJS setup and working

[See basic guide here](https://www.drupal.org/node/1713530). Steps I took at time of writing:

* [Install NodeJS](https://nodejs.org/en/download/) `v4.2.6` on your server
* `npm install drupal-node.js` should be outside of `docroot` and will default to `node_modules` folder
* `cd node_modules/drupal-node.js` and `cp nodejs.config.js.example nodejs.config.js`
* Edit `nodejs.config.js` with your config, at a bare minimum set `serviceKey` to a random value,
I also had to update the `backend.host` with the correct url for my drupal site
* Start the server `node app.js` also look at using [forever](https://github.com/beejeebus/drupal-nodejs#running-the-server-app)
* In your drupal site, go to `/admin/config/nodejs/settings` and add the `serviceKey` you created above. Other settings
should match your `nodejs.config.js` file (only thing I need to change was the host)
* The status report page `/admin/reports/status` should indicate drupal has found the NodeJS server

**NOTE:** At time of writing this, the "stable" release of `drupal/nodejs` (`v1.1`) was actually quite broken, the
`1.x-dev` version is far more robust.

### 3. Notifications - Optional, but handy for testing

Enable the `nodejs_notify` module, open a few browser windows and go to `/admin/config/nodejs/broadcast` in one of them
to send a message to all the others. If that works, this module should be ready to go!

The `nodejs_notify` module also provides [jGrowl](https://plugins.jquery.com/jgrowl/) which is used for notifications in
this module. If you don't want `nodejs_notify` enabled but still want notifications then include
[jGrowl manually](https://gist.github.com/stanlemon/5382662)

### 4. Disable polling

You don't need it anymore, set the `Ajax refresh rate` for messenger blocks and config to `0` so it wont poll anymore.

### 5. Test

If you are using [Private Message Messenger](https://github.com/jez500/Private-Message-Messenger), Open 2 different
browsers, each logged in as different users, send a message from one user to another, you should see threads and
blocks instantly update and a notification displayed.

## Author

This module is created by [Jeremy Graham](http://jez.me)
but wouldn't be possible without all the great work done by [Jaypan](https://www.drupal.org/u/jaypan)
on the [Private Message module](https://www.drupal.org/project/private_message)

