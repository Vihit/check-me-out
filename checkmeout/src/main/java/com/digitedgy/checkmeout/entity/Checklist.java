package com.digitedgy.checkmeout.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class Checklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(unique = true)
    private String name;
    private String equipmentType;
    private String sopNumber;
    @Column(columnDefinition = "text")
    private String template;
    private String changeControlReference;
    private String state;

    @CreatedBy
    @JsonIgnore
    @Column(name = "created_by")
    private String createdBy;
    @JsonIgnore
    @Column(name="create_dt")
    @CreationTimestamp
    private Timestamp createDt;
    @Column(name = "review_by")
    @JsonIgnore
    @LastModifiedBy
    private String reviewBy;
    @JsonIgnore
    @Column(name="review_dt")
    @UpdateTimestamp
    private Timestamp reviewDt;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEquipmentType() {
        return equipmentType;
    }

    public void setEquipmentType(String equipmentType) {
        this.equipmentType = equipmentType;
    }

    public String getSopNumber() {
        return sopNumber;
    }

    public void setSopNumber(String sopNumber) {
        this.sopNumber = sopNumber;
    }

    public String getTemplate() {
        return template;
    }

    public void setTemplate(String template) {
        this.template = template;
    }

    public String getChangeControlReference() {
        return changeControlReference;
    }

    public void setChangeControlReference(String changeControlReference) {
        this.changeControlReference = changeControlReference;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
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

    public String getReviewBy() {
        return reviewBy;
    }

    public void setReviewBy(String reviewBy) {
        this.reviewBy = reviewBy;
    }

    public Timestamp getReviewDt() {
        return reviewDt;
    }

    public void setReviewDt(Timestamp reviewDt) {
        this.reviewDt = reviewDt;
    }
}
