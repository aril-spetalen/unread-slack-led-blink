# unread-slack-led-blink
Blinkstick USB warning lamp for slack unread messages and mentions

Requirements: 

- a device with the ability to blink. I used a Blinkstick Nano, which has a simple node API. For setup instructions for a Blinkstick, read here: https://github.com/arvydas/blinkstick-node

- a slack account, and an own slack application with permissions set to read your own users data (at least).

- the OAuth2 token for slack app, assigned a variable called SLACK_BOT_TOKEN in your environment.
