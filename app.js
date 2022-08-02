"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
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

app.get("/getvideos", cors(corsOptions), (req, res, next) => {
	const filename = path.resolve(__dirname, "./data/videos.json");
	fs.readFile(filename)
		.then((rawData) => {
			res.status(200).json(JSON.parse(rawData));
		})
		.catch((error) => {
			console.error(`error in reading data file, -> ${error}`);
			res
				.status(400)
				.send({ message: `error in reading data file, -> ${error}` });
		});
});

app.get("/getcarousels", cors(corsOptions), (req, res, next) => {
	const filename = path.resolve(__dirname, "./data/carousels.json");
	fs.readFile(filename)
		.then((rawData) => {
			res.status(200).json(JSON.parse(rawData));
		})
		.catch((error) => {
			console.error(`error in reading data file, -> ${error}`);
			res
				.status(400)
				.send({ message: `error in reading data file, -> ${error}` });
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
			fs.readFile(filename)
				.then((rawData) => {
					try {
						videoData = JSON.parse(rawData);
					} catch (error) {
						console.log(`error parsing json -> ${error}`);
						res.status(400).send({ message: "error retrieving data" });
					}

					videoInfo = videoData.find((elem) => elem.ID === id);

					if (videoInfo) {
						console.log(`videonInfo -> ${videoInfo}`);
						res.status(200).json(videoInfo);
					} else {
						console.log(`videonInfo -> ${videoInfo}`);
						res
							.status(401)
							.send({ message: `video with ID = ${id} not found` });
					}
				})
				.catch((error) => {
					console.error(`error in reading data file, -> ${error}`);
					res
						.status(400)
						.send({ message: `error in reading data file, -> ${error}` });
				});
		}
	} else {
		res.status(400).send({
			message: 'body must include json object of the for {"id": "value"}',
		});
	}
});
