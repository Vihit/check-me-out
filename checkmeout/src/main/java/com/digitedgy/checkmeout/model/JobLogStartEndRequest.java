package com.digitedgy.checkmeout.model;

import java.sql.Timestamp;

public class JobLogStartEndRequest {
    private Integer jobId;
    private Integer jobLogId;
    private Timestamp startedOn;
    private Timestamp completedOn;

    public JobLogStartEndRequest() {
    }

    public JobLogStartEndRequest(Integer jobId, Integer jobLogId, Timestamp startedOn, Timestamp completedOn) {
        this.jobId = jobId;
        this.jobLogId = jobLogId;
        this.startedOn = startedOn;
        this.completedOn = completedOn;
    }

    public Integer getJobId() {
        return jobId;
    }

    public void setJobId(Integer jobId) {
        this.jobId = jobId;
    }

    public Integer getJobLogId() {
        return jobLogId;
    }

    public void setJobLogId(Integer jobLogId) {
        this.jobLogId = jobLogId;
    }

    public Timestamp getStartedOn() {
        return startedOn;
    }

    public void setStartedOn(Timestamp startedOn) {
        this.startedOn = startedOn;
    }

    public Timestamp getCompletedOn() {
        return completedOn;
    }

    public void setCompletedOn(Timestamp completedOn) {
        this.completedOn = completedOn;
    }
}
