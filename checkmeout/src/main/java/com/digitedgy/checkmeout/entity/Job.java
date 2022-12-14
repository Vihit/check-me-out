package com.digitedgy.checkmeout.entity;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "checklist_id")
    private Checklist checklist;
    private String equipmentName;
    @OneToMany(mappedBy = "job",cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<JobLog> jobLogs;
    private Timestamp startedOn;
    private Timestamp completedOn;

    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;
    @Column(name="create_dt")
    @CreationTimestamp
    private Timestamp createDt;
    @Column(name = "updated_by")
    @LastModifiedBy
    private String updatedBy;
    @Column(name="update_dt")
    @UpdateTimestamp
    private Timestamp updateDt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Checklist getChecklist() {
        return checklist;
    }

    public void setChecklist(Checklist checklist) {
        this.checklist = checklist;
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Timestamp getCreateDt() {
        return createDt;
    }

    public void setCreateDt(Timestamp createDt) {
        this.createDt = createDt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    public Timestamp getUpdateDt() {
        return updateDt;
    }

    public void setUpdateDt(Timestamp updateDt) {
        this.updateDt = updateDt;
    }

    public Set<JobLog> getJobLogs() {
        return jobLogs;
    }

    public void setJobLogs(Set<JobLog> jobLogs) {
        this.jobLogs = jobLogs;
    }

    public String getEquipmentName() {
        return equipmentName;
    }

    public void setEquipmentName(String equipmentName) {
        this.equipmentName = equipmentName;
    }
}
