import { Router } from "express";
import fs from "fs";

const TrackListRouter = Router();

let trackerHash: { [url: string]: boolean } = {
  ["doubleclick.net"]: true,
  ["google-analytics.com"]: true,
  ["ads.yahoo.com"]: true,
  ["pixel"]: true,
  ["track"]: true,
  ["adservice.google"]: true,
  ["adroll"]: true,
};

const retrieveTrackers = () => {
  fetch(
    "https://www.github.developerdan.com/hosts/lists/ads-and-tracking-extended.txt"
  )
    .then((response) => {
      response.text().then((text) => {
        text
          .split("\n")
          .filter((line) => !line.includes("#") && line !== "")
          .forEach((line) => {
            const trimmed = line.slice(line.indexOf(" ") + 1);
            trackerHash[trimmed.replace(/ww([w(0-9)]*)\./, "")] = true;
          });
        fs.writeFile(
          "out/trackers.json",
          JSON.stringify(trackerHash),
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
  trackerHash = JSON.parse(fileContent);
  console.log("Loaded existing trackers");
});

TrackListRouter.get("/trackerList", async (req, res) => {
  res.status(200).json(trackerHash);
});

export default TrackListRouter;
