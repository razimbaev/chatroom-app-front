# Simple Chatroom App

For the end result this app should support the following:

v1:

1. Chat should display most recent 500 messages or so
2. Use websocket for real time duplex communication between server and client
3. Store chat in s3 (maybe broken up into different blocks) and store metadata in either DynamoDB or RDB

v2:

4. Multiple chatrooms by topic (Topics will be predefined and NOT dynamically created by user)
5. Use Caching for better performance (maybe Redis)
6. Users should be able to register for account
7. Users should be able to post with or without account. If posting with account then display their username in messages
