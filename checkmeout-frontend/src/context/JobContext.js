import React from "react";

let job = {};
function setJob(job) {
  console.log("setting job");
  job = job;
}

const JobContext = React.createContext({
  job: job,
  setJob: setJob,
});

export default JobContext;
