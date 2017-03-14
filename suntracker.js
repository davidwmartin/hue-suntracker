// require modules
var querystring = require('querystring'),
		http = require('http'),
		crontab = require('crontab');


// request vars
var options = {
	host: 'http://api.sunrise-sunset.org/json?lat=34.168851&lng=-118.605448&date=today&formatted=0'
}


http.get(options.host, function(res){
	var data = "";

	// console.log('STATUS: ' + res.statusCode);
 //  console.log('HEADERS: ' + JSON.stringify(res.headers));
  
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log(chunk);
  });

});



// crontab.load(function(err, crontab) {
// 	if (err){
// 		return console.log(err);
// 	}
// 	// var command = "ls -l";
// 	// var job = crontab.create('ls -lt', null, 'comment 2');
// 	// var job = crontab.create('ls -la', '0 7 * * 1,2,3,4,5');

// 	// crontab.reset();

// 	// var jobs = crontab.jobs();
// 	// crontab.remove({command:"ls -lt"});

// 	// console.log(jobs);


// 	// crontab.save(function(err, crontab) {
  
//  //  });

//   // console.log(crontab);

// });