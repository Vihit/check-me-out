package com.digitedgy.checkmeout.model;

public class TaskActivity {
    private String action;
    private String actionOn;

    public TaskActivity() {
    }

    public TaskActivity(String action, String actionOn) {
        this.action = action;
        this.actionOn = actionOn;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActionOn() {
        return actionOn;
    }

    public void setActionOn(String actionOn) {
        this.actionOn = actionOn;
    }
}
