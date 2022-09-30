import React from "react";

let job = {};
function setJob(job) {
  job = job;
}

const JobContext = React.createContext({
  job: job,
  setJob: setJob,
});

export default JobContext;
