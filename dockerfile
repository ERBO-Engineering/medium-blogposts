# We chose node-14 since currently firebase functions work on node-14
# As from now node-16 is currently in beta for firebase functions
# But if you want to run the beta you can change node:14-alpine to node:16-alpine
# https://firebase.google.com/docs/functions/manage-functions#set_nodejs_version
FROM node:14-alpine 

# Install pesky JDK
RUN apk add openjdk11

# Install the firebase cli
RUN npm install -g firebase-tools

# Install and setup all the Firebase emulators
RUN firebase setup:emulators:database 
RUN firebase setup:emulators:firestore
RUN firebase setup:emulators:storage  
RUN firebase setup:emulators:ui       
    
# Mount your firebase project directory to /app when running the container
# This is the folder containing the firebase.json
WORKDIR /app

# Expose the emulator ports
# If you use non standard ports change them to the ones in your firebase.json
#       AUTH    STORE   FIRE    UI   emulator ports
EXPOSE  9099    9199    8080    9098

# When startup of the container is complete this is the command that will be executed
# In our case we want to start the firebase emulator suite
CMD ["firebase", "emulators:start"]