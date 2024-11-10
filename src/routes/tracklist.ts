import { Router } from "express";
import fs from "fs";

const TrackListRouter = Router();

let trackerList = [
  "doubleclick.net",
  "google-analytics.com",
  "ads.yahoo.com",
  "pixel",
  "track",
  "adservice.google",
  "adroll",
];

const retrieveTrackers = () => {
  fetch(
    "https://raw.githubusercontent.com/blocklistproject/Lists/refs/heads/master/tracking.txt"
  )
    .then((response) => {
      response.text().then((text) => {
        trackerList = text
          .split("\n")
          .filter((line) => !line.includes("#") && line !== "")
          .map((line) => line.slice(line.indexOf(" ") + 1));
        fs.writeFile(
          "out/trackers.json",
          JSON.stringify(trackerList),
          () => {}
        );
        console.log("Retrieved tracker list");
      });
    })
    .catch((reason) => {
      console.log(
        "Retrieving ad trackers failed, using default safety list",
        reason
      );
    });
};

fs.readFile("out/trackers.json", "utf-8", (err, fileContent) => {
  if (err) {
    retrieveTrackers();
    return;
  }
  trackerList = JSON.parse(fileContent);
  console.log("Loaded existing trackers");
});

TrackListRouter.get("/trackerList", async (req, res) => {
  res.status(200).json(trackerList);
});

export default TrackListRouter;
