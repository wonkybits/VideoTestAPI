# VideoTestAPI

API with test data for video playback apps

# Endpoints

https://videotestapi.herokuapp.com

1. `/getcarousels`
2. `/getvideos`
3. `/getvideoinfo`, must be a **POST** request with json body conforming to _{ "id": "value" }_ where _"value"_ is a number corresponding to a video id which can be retrieved from the output of _getvideos_
