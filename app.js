const GROUPMETOKEN = process.env['GROUPMETOKEN'];
const GIPHYTOKEN = process.env['GIPHYTOKEN'];
const GROUP = process.env['GROUP'];
const URL = process.env['URL'];
const AVATAR = process.env['AVATAR'];
const BOTNAME = process.env['BOTNAME'];
const BIBLETOKEN = process.env['BIBLETOKEN'];
const GOOGLE_API_KEY = process.env['GOOGLE_API_KEY'];
const GOOGLE_CSE_ID = process.env['GOOGLE_CSE_ID'];

const async = require("async");
const natural = require('natural');
const _ = require('underscore');
const util = require('util');
const request = require('request');

var tokenizer = new natural.WordPunctTokenizer();

var config =  { token:GROUPMETOKEN,
								name: "Tomato Bot",
								group: GROUP,
								url: URL
						};

if (AVATAR) {
	config.avatar_url = AVATAR;
}
if (BOTNAME) {
	config.name = BOTNAME;
}

var bot = require('fancy-groupme-bot')(config);

bot.on('botRegistered', function() {
	console.log("Bot Online");
});

bot.on('botMessage', function(bot, message) {
	console.log('Incoming Message from :' + message.name);
	if (message.name != config.name && message.text) {
		var tokens = tokenizer.tokenize(message.text);
		tokens = _.map(tokens, function(t) { return t.toLowerCase(); });
		var command = tokens[0] + tokens[1];
		//console.log('command: ' + command);
		//console.log('tokens: ' + tokens);
		if (command.indexOf('/m') >= 0 || command.indexOf('/meme') >= 0) {
			tokens.splice(0, 2);
			async.series([
			function(callback){
				require('./meme.js')(message.text.substr(message.text.indexOf(" ") + 1), callback);
			}],
			function(err, results){
				console.log("Sending mem msg :" + results[0]);
				if (results[0].length > 999){
					var re = results[0].match(/[\s\S]{1,950}\S*/g);
					//console.log(re);
					async.eachSeries(re, function iterator(item, callback) {
						setTimeout(function() {
							bot.message(item);
							callback(null, null);
						}, 1500);
					}, function done() {

					});
				}
				bot.message(results[0]);
			});
		}
		if (BIBLETOKEN && command.indexOf('/bible') >= 0) {
			tokens.splice(0, 2);
			console.log("searching for " + tokens);
			var version = "ESV";
			switch (tokens[0].toLowerCase()) {
				case "kjv":
					version = "KJV";
					tokens.splice(0, 1);
					break;
				case "nasb":
					version = "NASB";
					tokens.splice(0, 1);
					break;
				case "esv":
					tokens.splice(0, 1);
					break;
			}
			request.get("https://" + BIBLETOKEN + "@bibles.org/v2/passages.js?version=eng-" + version + "&q[]=" + escape(tokens.join('+')), function (error, response, body) {
				if (error) console.error(error);
				var response = JSON.parse(body);
				if (response.response.search.result.passages[0]) {
					var verse = response.response.search.result.passages[0].text.replace(/<(?:.|\n)*?>/gm, '').replace(/(\d)+/g, '$& ');
					if (verse.length > 999){
						var verses = verse.match(/[\s\S]{1,950}\S*/g);
						async.eachSeries(verses, function iterator(item, callback) {
							setTimeout(function() {
								bot.message(item);
								callback(null, null);
							}, 1500);
						}, function done() {

						});
					}else{
						bot.message(verse);
					}
				}else
				{
					bot.message('Sorry, no verse is found.');
				}
			});
		}
		if (command.indexOf('/video') >= 0 || command.indexOf('/youtube') >= 0 || command.indexOf('/yt') >= 0 || command.indexOf('/v') >= 0 ) {
			tokens.splice(0, 2);
			tokens = message.text.match(/^\/(?:video|youtube|yt|v)(!)?(?:(?:\s+)(.+))?/i);
			var query = tokens[2];
			console.log("searching for " + tokens);
			var videoUrl = '';
			request.get({
					url: "https://www.googleapis.com/youtube/v3/search",
	      	qs: {
						key: GOOGLE_API_KEY,
		        part: 'id',
		        type: 'video',
		        maxResults: 10,
		        q: query
	      	}
	    	}, function (error, response, body) {
				if (error) console.error(error);
				var data = JSON.parse(body);
				var videos = data.items;
				if (videos) {
					response = _.shuffle(videos);
					var video = response[0].id.videoId;
					videoUrl = 'https://www.youtube.com/watch?v=' + video;
					console.log("sending a message " + videoUrl);
					bot.message(videoUrl);
				}else
				{
					bot.message('Sorry, no results are found from YouTube.');
				}
			});
		}
		if (command.indexOf('/gif') >= 0) {
			tokens = _.without(tokens, '/gif');
			tokens.splice(0, 2);
			tokens = message.text.match(/^\/(?:gif)(!)?(?:(?:\s+)(.+))?/i);
			var query = tokens[2];
			console.log("searching for " + query);
			request.get({
						url: "https://www.googleapis.com/customsearch/v1",
		      	qs: {
							key: GOOGLE_API_KEY,
							cx: GOOGLE_CSE_ID,
			        searchType: 'image',
			        q: query,
							fileType: 'gif',
							hq: 'animated',
							tbs: 'itp:animated'
		      	}
		    	}, function (error, response, body) {
							if (error) console.error(error);
							var info = JSON.parse(body);
							if (info.items.length) {
								response = _.shuffle(info.items);
								var imageUrl = response[0].link;
								console.log("sending a message " + imageUrl);
								bot.message(imageUrl);
							}else
							{
								bot.message('Sorry, no results are found from Google.');
							}
			});
		}
		if (message.text.toLowerCase().indexOf('#thanksobama') >= 0) {
			request.get("http://www.reddit.com/r/thanksobama/top.json?&limit=100&t=all", function (error, response, body) {
				if (error) console.error(error);
				var info = JSON.parse(body);
				response = _.shuffle(info.data.children);
				var imageUrl = response[0].data.url;
				if(imageUrl.indexOf("i.imgur.com/") == -1 && imageUrl.indexOf("imgur.com/") != -1){
					imageUrl = "http://i.imgur.com/" + imageUrl.substring(imageUrl.indexOf(".com/") + 5) + ".jpg";
				}
				console.log("sending a message " + imageUrl);
				bot.message(imageUrl);
			});
		}
		if (command.indexOf('/giphy') >= 0) {
			tokens = message.text.match(/^\/(?:giphy)(!)?(?:(?:\s+)(.+))?/i);
			console.log("searching for " + tokens[2]);
			request.get({
				url: "http://api.giphy.com/v1/gifs/search",
      	qs: {
	        q: tokens[2],
	        limit: 50,
	        api_key: GIPHYTOKEN,
	        rating: 'r'
      	}
    	}, function (error, response, body) {
				if (error) console.error(error);
				var data = JSON.parse(body);
				if (data.data.length) {
					data = _.shuffle(data.data);
					var image = data[0];
					//console.log(image);
					if (image && image.images) {
						var variant = (image.images.original || image.images.fixed_height);
						if (variant && variant.url) {
							console.log("sending a message " + variant.url);
							bot.message(variant.url);
						}
					}
				}else
				{
					//console.log(data);
					bot.message('Sorry, no results are found from Giphy');
				}
			});
		}
		if (command.indexOf('/img') >= 0 || command.indexOf('/image') >= 0) {
			tokens = _.without(tokens, '/img');
			tokens.splice(0, 2);
			tokens = message.text.match(/^\/(?:img|image)(!)?(?:(?:\s+)(.+))?/i);
			var query = tokens[2];
			console.log("searching for " + query);
			request.get({
						url: "https://www.googleapis.com/customsearch/v1",
		      	qs: {
							key: GOOGLE_API_KEY,
							cx: GOOGLE_CSE_ID,
			        searchType: 'image',
			        q: query;
		      	}
		    	}, function (error, response, body) {
							if (error) console.error(error);
							var info = JSON.parse(body);
							if (info.items.length) {
								response = _.shuffle(info.items);
								var imageUrl = response[0].link;
								console.log("sending a message " + imageUrl);
								bot.message(imageUrl);
							}else
							{
								bot.message('Sorry, no results are found from Google.');
							}
			});}
		if (message.text.toLowerCase().indexOf('i\'ll allow it') >= 0) {
			var imageUrl = "http://i.imgur.com/YcUg2Fr.gif";
			console.log('sending a message ' + imageUrl);
			bot.message(imageUrl);
		}
		if (tokens.indexOf('clueless') >= 0) {
			var imageUrl = "http://ak-hdl.buzzfed.com/static/2014-10/26/6/enhanced/webdr08/enhanced-14836-1414320930-8.jpg";
			console.log('sending a message ' + imageUrl);
			bot.message(imageUrl);
		}
		if (tokens.indexOf('nods') >= 0) {
			var Urls = ["http://replygif.net/i/159.gif",
								"http://replygif.net/i/1248.gif",
								"http://replygif.net/i/163.gif",
								"http://replygif.net/i/542.gif",
								"http://i3.kym-cdn.com/entries/icons/original/000/012/982/post-19715-Brent-Rambo-gif-thumbs-up-imgu-L3yP.gif"];
			var imageUrl = Urls[Math.floor(Math.random()*Urls.length)];
			console.log('sending a message ' + imageUrl);
			bot.message(imageUrl);
		}
		if (message.text.toLowerCase().indexOf('don\'t even care') >= 0) {
			var Urls = ["http://gifrific.com/wp-content/uploads/2012/07/Ron-Swanson-Says-Dont-Even-Care.gif",
								"https://media.giphy.com/media/ryOujCIH2dyla/giphy.gif"];
			var imageUrl = Urls[Math.floor(Math.random()*Urls.length)];
			console.log('sending a message ' + imageUrl);
			bot.message(imageUrl);
		}
		if (tokens.indexOf('gayyy') >= 0) {
			var Urls = ["http://i0.kym-cdn.com/photos/images/newsfeed/000/466/626/c18.gif",
								"http://i.imgur.com/lJB8XUt.jpg"];
			var imageUrl = Urls[Math.floor(Math.random()*Urls.length)];
			console.log('sending a message ' + imageUrl);
			bot.message(imageUrl);
		}
	}
});

bot.serve(process.env['PORT'] || 3000);
