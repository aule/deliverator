The Deliverator will respond to POST requests and send the text of the request to all subscribed clients via websockets.
The post request can come from any source but the original idea was to use Git hooks which will send a post request for any commit - in so doing, the Deliverator will actuate its arm and hit a gong.

Installation and use:

1) simply "npm install" after pulling files
2) need to use https://www.npmjs.com/package/pi-gpio and possibly modify quick2wire-gpio-admin and fix the path to the gpio devices - change "/sys/devices/virtual" to "/sys/class" in src/gpio-admin.c - see https://github.com/rexington/quick2wire-gpio-admin/commit/e1974dd197573a0a846a9fbe35d9f3ff1cbb3884#comments

Start the server with "node server.js" - currently listens on port 3000, endpoint /send/<topic> to receive post request.
Start clients with "node client.js -u ws://example.com -h gpio -t topic1 topic2" or using a config.json file such as
{
  "url":"http://thing.com:3000",
  "hammer":"gpio",
  "topics":["test","deliverator"]
}
This supports USB devices (eg USB serial relays) and RPi GPIO pins (eg driving MOSFET boards) so can switch a device on/off for a short period - eg to actuate a solenoid to move an arm to hit a gong or some such thing.

Enjoy!
