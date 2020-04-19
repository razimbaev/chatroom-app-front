# Simple Chatroom App

For the end result this app should support the following:

1. Chat should display most recent 500 messages or so
2. Use websocket for real time duplex communication between server and client
3. Store chat and metadata in any combination of S3 DynamoDB or RDB
4. Multiple chatrooms by topic
5. Use Caching for better performance (maybe Redis)
6. Users should be able to register for account
7. Users should be able to post with or without account. If posting with account then display their username in messages
