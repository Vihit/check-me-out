package com.digitedgy.checkmeout.controller;

import com.digitedgy.checkmeout.entity.Job;
import com.digitedgy.checkmeout.entity.JobLog;
import com.digitedgy.checkmeout.model.Comment;
import com.digitedgy.checkmeout.model.JobLogCommentRequest;
import com.digitedgy.checkmeout.model.JobLogStartEndRequest;
import com.digitedgy.checkmeout.repository.JobLogRepository;
import com.digitedgy.checkmeout.service.JobLogService;
import com.digitedgy.checkmeout.service.JobService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping(path = "/joblog/")
public class JobLogController {

    @Autowired
    JobLogService jobLogService;

    @Autowired
    JobService jobService;

    @GetMapping("/all/{jobId}/")
    public ResponseEntity<?> getJobLogsForJob(@PathVariable(name = "jobId") Integer jobId) {
        Iterable<JobLog> jobLogs = jobLogService.getAllByJobId(jobId);
        return new ResponseEntity<>(jobLogs, HttpStatus.OK);
    }

    @PutMapping("/comments/")
    public ResponseEntity<?> updateJobLogComments(@RequestBody JobLogCommentRequest jobLogCommentRequest) throws Exception{
        Optional<JobLog> existingJobLog = jobLogService.getJobLogById(jobLogCommentRequest.getJobLogId());
        if(existingJobLog.isPresent()) {
            String comments = existingJobLog.get().getComments();
            ObjectMapper mapper = new ObjectMapper();
            List<Comment> existingComments = new ArrayList<>(Arrays.asList(mapper.readValue(comments, Comment[].class)));
            existingComments.add(jobLogCommentRequest.getComment());
            String updatedComments = mapper.writeValueAsString(existingComments);
            System.out.println(updatedComments);
            existingJobLog.get().setComments(updatedComments);
            JobLog savedJobLog = jobLogService.update(existingJobLog.get());
            return new ResponseEntity<>(jobService.getJobById(jobLogCommentRequest.getJobId()),HttpStatus.OK);
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Non-existing JobLog");
    }

    @PutMapping("/start-stop/")
    public ResponseEntity<?> updateJobLogStartEnd(@RequestBody JobLogStartEndRequest jobLogStartEndRequest) throws Exception{
        Optional<JobLog> existingJobLog = jobLogService.getJobLogById(jobLogStartEndRequest.getJobLogId());
        if(existingJobLog.isPresent()) {
            existingJobLog.get().setStartedOn(jobLogStartEndRequest.getStartedOn());
            existingJobLog.get().setCompletedOn(jobLogStartEndRequest.getCompletedOn());
            JobLog savedJobLog = jobLogService.update(existingJobLog.get());
            if(jobLogStartEndRequest.getCompletedOn()!=null) {
                Iterable<JobLog> jobLogs = jobLogService.getAllByJobId(jobLogStartEndRequest.getJobId());
                long incompleteTasks = StreamSupport.stream(jobLogs.spliterator(),false).filter(jobLog -> jobLog.getCompletedOn()==null).count();
                if(incompleteTasks == 0) {
                    jobService.updateCompletedOn(jobLogStartEndRequest.getJobId(),jobLogStartEndRequest.getCompletedOn());
                }
            }
            return new ResponseEntity<>(jobService.getJobById(jobLogStartEndRequest.getJobId()),HttpStatus.OK);
        }
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Non-existing JobLog");
    }
}
