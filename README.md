# airhockey socket

Try to deploy a version of the [airhockey](https://atlemagnussen.github.io/airhockey) that works with multiplayer and websocket

First try is [Google Cloud Flexible App Engine](https://cloud.google.com/appengine/docs/flexible/nodejs/using-websockets-and-session-affinity)

## Deploy server
https://airhockey-socket.appspot.com
```sh
gcloud app deploy
```
read logs
```sh
gcloud app logs tail -s default
```

## Deploy client
https://airhockey-socket.firebaseapp.com
```sh
firebase deploy
```