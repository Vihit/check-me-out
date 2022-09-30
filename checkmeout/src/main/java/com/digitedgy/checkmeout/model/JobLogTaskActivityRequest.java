package com.digitedgy.checkmeout.model;

public class JobLogTaskActivityRequest {
    private Integer jobId;
    private Integer jobLogId;
    private Integer taskActivityId;
    private TaskActivity taskActivity;

    public JobLogTaskActivityRequest() {
    }

    public JobLogTaskActivityRequest(Integer jobId, Integer jobLogId, Integer taskActivityId,TaskActivity taskActivity) {
        this.jobId = jobId;
        this.jobLogId = jobLogId;
        this.taskActivity = taskActivity;
        this.taskActivityId = taskActivityId;
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

    public TaskActivity getTaskActivity() {
        return taskActivity;
    }

    public void setTaskActivity(TaskActivity taskActivity) {
        this.taskActivity = taskActivity;
    }

    public Integer getTaskActivityId() {
        return taskActivityId;
    }

    public void setTaskActivityId(Integer taskActivityId) {
        this.taskActivityId = taskActivityId;
    }
}
