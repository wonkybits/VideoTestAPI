"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.listen(8080, () => {
// 	console.log("server running on port 8080");
// });

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}...`));

app.use(cors());
const corsOptions = {
	origin: "*",
};

app.get("/", (req, res, next) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/videotest", cors(corsOptions), (req, res) => {
	res.sendFile(path.join(__dirname, "videoTest.html"));
});

app.get("/getvideos", cors(corsOptions), (req, res, next) => {
	const filename = path.resolve(__dirname, "./data/videos.json");
	fs.readFile(filename, (err, data) => {
		if (err) {
			console.error(`error in reading data file, -> ${err}`);
			res
				.status(400)
				.send({ message: `error in reading data file, -> ${err}` });
		}

		res.status(200).json(JSON.parse(data));
	});
});

app.get("/getcarousels", cors(corsOptions), async (req, res, next) => {
	const filename = path.resolve(__dirname, "./data/carousels.json");

	fs.readFile(filename, (err, data) => {
		if (err) {
			console.error(`error in reading data file, -> ${err}`);
			res
				.status(400)
				.send({ message: `error in reading data file, -> ${err}` });
		}
		res.status(200).json(JSON.parse(data));
	});
});

app.post("/getvideoinfo", cors(corsOptions), (req, res, next) => {
	const id = req.body.id;
	if (id) {
		if (isNaN(id)) {
			res.status(400).send({ message: "'id' must be a number" });
		} else {
			const filename = path.resolve(__dirname, "./data/videos.json");
			let videoData = [];
			let videoInfo = null;

			fs.readFile(filename, (err, data) => {
				if (err) {
					console.error(`error in reading data file, -> ${error}`);
					res
						.status(400)
						.send({ message: `error in reading data file, -> ${error}` });
				}

				try {
					videoData = JSON.parse(data);
				} catch (error) {
					console.error(`error parsing json -> ${error}`);
					res.status(400).send({ message: "error retrieving data" });
				}

				videoInfo = videoData.find((elem) => elem.ID === id);

				if (videoInfo) {
					res.status(200).json(videoInfo);
				} else {
					console.error(`video with ID = ${id} not found`);
					res.status(401).send({ message: `video with ID = ${id} not found` });
				}
			});
		}
	} else {
		res.status(400).send({
			message: 'body must include json object of the for {"id": "value"}',
		});
	}
});

app.get("/video", cors(corsOptions), function (req, res) {
	const range = req.headers.range;
	if (!range) {
		res.status(400).send("Requires Range header");
	}

	const videoPath = path.resolve(__dirname, "./videos/bigbuck.mp4");
	const videoSize = fs.statSync(videoPath).size;
	const CHUNK_SIZE = 10 ** 6;
	const start = Number(range.replace(/\D/g, ""));
	const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
	const contentLength = end - start + 1;
	const headers = {
		"Content-Range": `bytes ${start}-${end}/${videoSize}`,
		"Accept-Ranges": "bytes",
		"Content-Length": contentLength,
		"Content-Type": "video/mp4",
	};

	res.writeHead(206, headers);

	const videoStream = fs.createReadStream(videoPath, { start, end });

	videoStream.pipe(res);
});
