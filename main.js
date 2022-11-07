const needle = require('needle');
const http = require('http');
const { head } = require('needle');

// server
const hostname = '127.0.0.1';
const port = 5000;

const server = http.createServer((request, response) => {
	let data = "";
	let headers = {}

	// копируем все заголовки запроса, кроме "host" и targetUrl
	for (let key in request.headers) {
		if (key !== "host" && key !== "target")
			headers[key] = request.headers[key];
	}
	const options = {
		headers: {
			"content-type": 'application/json'
		}
	};

	// загрузка данных
	request.on("data", chunk => {
		data += chunk;
	});

	// в конце загрузки данных посылаем запрос по targetUrl
	request.on("end", () => {
		try {
			data = JSON.parse(data);
			options["headers"]["Authorization"] = data["Authorization"];
			let method = data["method"];
			let targetUrl = "https://api.zoom.us/v2/users/" + data["endPoint"];

			needle(method, targetUrl, data, options)
				.then((target_response) => {
					console.log(`Status: ${target_response.statusCode}`);
					console.log('Body: ', target_response.body);
					response.statusCode = target_response.statusCode;
					response.setHeader('Access-Control-Allow-Origin', '*');
					response.statusText = JSON.stringify(target_response.body);
					response.setHeader('Content-Type', 'text/plain');
					response.end(JSON.stringify(target_response.body));
				}).catch((err) => {
					response.end("Error of request");
					console.error(err);
			});
		}
		catch (err) {
			console.log(err);
			response.end(err);
		}
		
	});
})
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})



