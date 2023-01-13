const express = require('express');
var bodyParser = require('body-parser')
const needle = require('needle');
var cors = require('cors');
const app = express();
//app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(cors({
	origin: '*'
}));
const PORT = process.env.PORT || 5000

app.get('/', (req, res) => {
	res.send({ message: 'You should to use post request:)' });
});

app.post('/', (req, res) => {
	// Здесь будем создавать заметку.
	res.statusCode = 200
	res.setHeader('Content-Type', 'text/plain')
	res.setHeader('Access-Control-Allow-Origin', '*');
	let targetUrl = "https://api.clarivate.com/apis/wos-starter/v1/documents";
	let method = 'GET';
	let data = {};
	let options = {
		headers: {
			"X-ApiKey": `d33fb239c06530922e8d200606f741c980e3e286`
		}
	};

	needle(method, targetUrl, data, options)
		.then((target_response) => {
			console.log(`Status: ${target_response.statusCode}`);
			console.log('Body: ', target_response.body);
			res.statusCode = target_response.statusCode;
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.statusText = JSON.stringify(target_response.body);
			res.setHeader('Content-Type', 'text/plain');
			res.end(JSON.stringify(target_response.body));
		}).catch((err) => {
		response.end("Error of request");
		console.error(err);
	});

});

app.listen(PORT, () => {
	console.log('We are live on ' + PORT);
});