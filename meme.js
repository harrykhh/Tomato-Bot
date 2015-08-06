const request = require('request');
const async = require("async");

var matchers = [{
  pattern: /^(y u no) (.*)/i,
  help: 'y u no <b>{text}</b>',
  url: 'NryNmg'
}, {
  pattern: /^aliens? guy (.+)/i,
  help: 'aliens guy <b>{text}</b>',
  url: 'sO-Hng',
  singleText: true
}, {
  pattern: /^((?:prepare|brace) (?:yourself|yourselves)) (.+)/i,
  help: 'brace yourself <b>{text}</b>',
  url: '_I74XA'
}, {
  pattern: /^(.*) (all the .*)/i,
  help: '<b>{text}</b> all the <b>{things}</b>',
  url: 'Dv99KQ'
}, {
  pattern: /^(i don'?t (?:always|normally) .*) (but when i do,? .*)/i,
  help: 'I don\'t always <b>{something}</b> but when I do <b>{text}</b>',
  url: 'V8QnRQ'
}, {
  pattern: /^(.*) (\w+\stoo damn .*)/i,
  help: '<b>{text}</b> too damn <b>{something}</b>',
  url: 'RCkv6Q'
}, {
  pattern: /^(not sure if .*) (or .*)/i,
  help: 'not sure if <b>{something}</b> or <b>{something else}</b>',
  url: 'CsNF8w'
}, {
  pattern: /^(yo dawg,? .*) (so .*)/i,
  help: 'yo dawg <b>{text}</b> so <b>{text}</b>',
  url: 'Yqk_kg'
}, {
  pattern: /^(all your .*) (are belong to .*)/i,
  help: 'all your <b>{text}</b> are belong to <b>{text}</b>',
  url: '76CAvA'
}, {
  pattern: /^(one does not simply) (.*)/i,
  help: 'one does not simply <b>{text}</b>',
  url: 'da2i4A'
}, {
  pattern: /^(if you .*\s)(.* gonna have a bad time)/i,
  help: 'if you <b>{text}</b> gonna have a bad time',
  url: 'lfSVJw'
}, {
  pattern: /^(if .*), ((?:are|can|do|does|how|is|may|might|should|then|what|when|where|which|who|why|will|won't|would) .*)/i,
  help: 'if <b>{text}</b>, <b>{word that can start a question}</b> <b>{text}</b>?',
  url: '-kFVmQ'
}, {
  pattern: /^((?:how|what|when|where|who|why) the (?:hell|heck|fuck|shit|crap|damn)) (.*)/i,
  help: '<b>{word that can start a question}</b> the <b>{expletive}</b> <b>{text}</b>',
  url: 'z8IPtw'
}, {
  pattern: /^(?:success|nailed it) when (.*) then (.*)/i,
  help: 'success when <b>{text}</b> then <b>{text}</b>',
  url: 'AbNPRQ'
}, {
  pattern: /^(?:fwp|cry) when (.*) then (.*)/i,
  help: 'cry when <b>{text}</b> then <b>{text}</b>',
  url: 'QZZvlg'
}, {
  pattern: /^bad luck when (.*) then (.*)/i,
  help: 'bad luck when <b>{text}</b> then <b>{text}</b>',
  url: 'zl3tgg'
}, {
  pattern: /^scumbag(?: steve)? (.*) then (.*)/i,
  help: 'scumbag <b>{text}</b> then <b>{text}</b>',
  url: 'RieD4g'
}, {
  pattern: /^(what if i told you) (.+)/i,
  help: 'what if I told you <b>{text}</b>',
  url: 'fWle1w'
}, {
  pattern: /^(i hate) (.+)/i,
  help: 'I hate <b>{text}</b>',
  url: '_k6JVg'
}, {
  pattern: /^(why can'?t (?:i|we|you|he|she|it|they)) (.+)/i,
  help: 'why can\'t <b>{personal pronoun}</b> <b>{text}</b>',
  url: 'gdNXmQ'
}, {
  pattern: /^(.+),? (so i(?:(?:(?:'?ve)? got)|(?: have)) that going for me(?:,? which is nice)?)/i,
  help: '<b>{text}</b> so I got that going for me',
  url: 'h9ct5g'
}, {
  pattern: /^(.+),? (how (?:do (?:they|I)|does (?:he|she|it)) work\??)/i,
  help: '<b>{things}</b>, how do they work?',
  url: '3V6rYA'
}, {
  pattern: /^(do you want .*) (because that'?s how .*)/i,
  help: 'do you want <b>{text}</b> because that\'s how <b>{text}</b>',
  url: 'bxgxOg'
},  {
  pattern: /^(.* or .*) (why not both.*)/i,
  help: '<b>{text}</b> or <b>{text}</b> why not both?<b>{text}</b>',
  url: 'F-djfg'
},{
  pattern: /^asianfather (.*) (.*)/i,
  help: 'asianfather <b>{text}</b> <b>{text}</b>',
  url: 'ySCWIQ'
}, {
  pattern: /^(.*) (everywhere)/i,
  help: '<b>{text}</b> <b>everywhere</b>',
  url: 'yDcY5w'
}, {
  pattern: /^((?:yeah|if).*) (that would be great)/i,
  help: '<b>{text}</b> <b>that would be great</b>',
  url: 'q1cQXg'
}, {
  pattern: /^advicemallard (.*) (.*)/i,
  help: '<b>advicemallard</b> <b>{text}</b>',
  url: 'wJFFdQ'
}, {
  pattern: /^badadvicemallard (.*) (.*)/i,
  help: '<b>badadvicemallard</b> <b>{text}</b>',
  url: 'GVoIBA'
}, {
  pattern: /^awkwardseal (.*) (.*)/i,
  help: '<b>awkwardseal</b> <b>{text}</b>',
  url: 'VRVU0A'
}, {
  pattern: /^(.*) ((?:(?:a{1,})(?:n{1,})(?:d{1,})).*)/i,
  help: '{text}<b>{any combination of AND (AAANNND)}</b>{text}',
  url: 'uIZe3Q'
}, {
  pattern: /^(.+?(?:a{3,}|e{3,}|i{3,}|o{3,}|u{3,}|y{3,}).*)/i,
  help: '{text}<b>{3 x a|e|i|o|u|y}</b>{text}',
  url: 'L50mqA'
}, {
  help: '<b>{image url}</b> | <b>{top text}</b> | <b>{bottom text}</b>'
}];

module.exports = function(command, done){
	var message = "Sorry no meme was matched with your command."
	if (command && (command.charAt(0) == '?' || command.split(' ')[0] == 'help')){
		message = '';
		matchers.forEach(function(entry) {
			message += entry.help + '\n';
		});
		return done(null ,message);
	}
	matchers.forEach(function(entry) {
		if(command && command.match(entry.pattern)){
			async.series([
			function(callback){
				var str = command.match(entry.pattern);
				//console.log(str);
				if (entry.singleText){
					str[2] = str[1];
					str[1] = ' ';
				}
				generate(entry.url, str[1], str[2], callback);
			}],
			function(err, results){
				message = results[0];
				return done(null ,message);
			});
		}
	});
	if(command && command.match(/^(?:(https?:\/\/[^|\s]+\.(?:jpe?g|gif|png)[^|\s]*))\s*\|\s*([^|]*)\s*\|\s*([^|]*)/i)){
    var str = command.match(/^(?:(https?:\/\/[^|\s]+\.(?:jpe?g|gif|png)[^|\s]*))\s*\|\s*([^|]*)\s*\|\s*([^|]*)/i);
    var url = str[1];
    var text1 = str[2];
    var text2 = str[3];
    //console.log('cmd ' + command);
    //console.log('url ' +url);
    //console.log('str ' +str);
    //console.log('text1 ' +text1);
    //console.log('text2 ' +text2);
    var response = request.post({
        url: 'http://memecaptain.com/src_images',
        json: true,
        body: {url: url},
      }, function (error, response, body) {
          code = response.statusCode;
          json = response.body;
          if (code == 202) {
            var pollUrl = response.headers.location;
            if (!pollUrl) {
              return done(null, 'Poll URL not found');
            }
            async.series([
      			function(callback){
      				pollForResult(pollUrl, 0, callback);
      			}],
      			function(err, r){
              async.series([
        			function(callback){
                //console.log('results ' + r[0]);
        				generate(json.id, text1, text2, callback);
        			}],
        			function(err, results){
        				message = results[0];
                //console.log('results ' + message);
        				return done(null ,message);
        			});
      			});
          } else {
            return done(null, 'Unexpected response: ' + code, json);
          }
      });
  }
}

function generate(url, text1, text2, callback) {
  var sourceImageId = url;
  text1 = (text1 || '').trim();
	text2 = (text2 || '').trim();
	try {
    var resp = request.post({
      url: 'http://memecaptain.com/gend_images',
      json: true,
      body: {
        src_image_id: sourceImageId,
        captions_attributes: [{
          text: text1,
          top_left_x_pct: 0.05,
          top_left_y_pct: 0,
          width_pct: 0.9,
          height_pct: 0.25
        }, {
          text: text2,
          top_left_x_pct: 0.05,
          top_left_y_pct: 0.75,
          width_pct: 0.9,
          height_pct: 0.25
        }]
      }
    }, function (error, response, body) {
        code = response.statusCode;
        json = response.body;
        if (code == 202) {
          var pollUrl = response.headers.location;
          if (!pollUrl) {
            callback (null, 'Poll URL not found');
          }
          async.series([
    			function(callback){
    				pollForResult(pollUrl, 0, callback);
    			}],
    			function(err, results){
    				callback(null, results[0]);
    			});
        } else {
          callback (null, 'Unexpected response: ' + code + ' URL: http://memecaptain.com/gend_images/' + sourceImageId);
        }
      });
  	} catch (err) {
  		callback (null, 'Sorry, I can\'t connect to memecaptain.com right now.');
  	}
}

function pollForResult(pollUrl, attempt, callback) {
  attempt = attempt || 1;
  if (attempt > 40) {
    return null;
  }
  var pollResponse = request.get({url: pollUrl, followRedirect: false
    }, function (error, response, body) {
      //console.log(attempt);
      switch (response.statusCode) {
        case 200:
          var nextAttemptDelay = 500 * attempt;
          //console.log(nextAttemptDelay);
          return setTimeout(function() {
            pollForResult(pollUrl, attempt + 1, callback);
          }, nextAttemptDelay);
        case 303:
          return callback(null, response.headers.location);
        default:
          console.log('Unexpected response: ' + response.statusCode, pollUrl);
          return callback(null, null);
        }
    });
}
