# Tomato bot

A bot for [Groupme](http://group.me) that let's your group inject
hilarious animated gif's from [Giphy](http://giphy.com) into your
super serious khaki pants groupme chat.

## Heroku Setup

The bot is easy to set up on [Heroku](http://heroku.com). The bot
itself uses the
[Fancy Groupme Bot](http://github.com/cmcavoy/fancy-groupme-bot) Node
module to do its business.

### Get your credentials

Your bot needs a few things, a name, a room to connect to and a Groupme Token (you need to [create an application](https://dev.groupme.com/applications/new) to get a token).

**The Steps**

1. Go ahead and set up a [Heroku account](https://devcenter.heroku.com/articles/quickstart).

2. `git clone git@bitbucket.org:harrykhh/tomato-bot.git`

3. `cd tomato-bot`

4. `heroku create` and make note of the url that Heroku creates.

5. The bot expects a few enviroment variables to be set on Heroku, all of which you can do from the command line.

```
heroku config:set BOTNAME=[Name of Bot]
heroku config:set GIPHYTOKEN=dc6zaTOxFJmzC # this is the beta app token from [Giphy API](https://github.com/giphy/GiphyAPI). It may change in the future.
heroku config:set GROUP=[the room id you want the bot to connect to]
heroku config:set GROUPMETOKEN=[the groupme token you got when you registered an [application](https://dev.groupme.com/applications/new)]
heroku config:set URL=[the url that heroku created for your app]
heroku config:set AVATAR=[the avatart image url for the new bot]
heroku config:set BIBLETOKEN=[Bible Token] fron [bibles.org](http://bibles.org)]
heroku config:set YOUTUBE_API_KEY=[YouTube api key] from [Google](http://console.developers.google.com)

```

6. Push the code to heroku `git push heroku master`


### Commands
```
1. /meme or /m for different memes, /m ? or /m help for guides

2. /bible [OPTIONAL, ESV by default] ESV|NASB|KJV [BOOK NAME] [VERSE NUMBER] eg: /bible Johh 1:1-15

3. /video or /youtube or /v or /yt for Youtube videoes

4. /gif for animated pictures from Google

5. /giphy for animated gifs from Giphy

6. /img or /image for images from Google

7. "I'll allow it", "nods", "Don't Even Care", "Clueless", "gayyy" automatic response gifs

```
