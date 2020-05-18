# Simple Chatroom App

Features

1. Users can create chatrooms
2. Users send and receive chatroom messages in real time (websockets)
3. Chatroom auto scrolls down when convenient and display latest message notification
4. Chatroom displays users in chatroom in real time
5. Users can change username as often as desired
6. Users can search for chat by name
7. Users can view all chats they've participated in
8. Usernames and messages are persisted

How To run locally

1. Download and run DynamoDB locally (port 8000)
2. Download and run Redis locally (port 6379)
3. Checkout chatroom-service project (requires Java 11) and run ChatroomServiceApplication class (on port 8080) with following environment variables: spring_profiles_active=dev;spring_redis_host=localhost
4. Checkout this project (chatroom-app-front) and run "npm start" command to start the UI (port 3000)
5. View the Web UI at http://localhost:3000/
