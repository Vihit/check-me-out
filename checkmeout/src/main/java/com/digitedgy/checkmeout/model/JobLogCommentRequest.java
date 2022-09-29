package com.digitedgy.checkmeout.model;

public class JobLogCommentRequest {
    private Integer jobId;
    private Integer jobLogId;
    private Comment comment;

    public JobLogCommentRequest(Integer jobId, Integer jobLogId, Comment comment) {
        this.jobId = jobId;
        this.jobLogId = jobLogId;
        this.comment = comment;
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

    public Comment getComment() {
        return comment;
    }

    public void setComment(Comment comment) {
        this.comment = comment;
    }
}
