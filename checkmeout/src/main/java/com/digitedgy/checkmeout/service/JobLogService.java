package com.digitedgy.checkmeout.service;

import com.digitedgy.checkmeout.entity.JobLog;
import com.digitedgy.checkmeout.repository.JobLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JobLogService {

    @Autowired
    JobLogRepository jobLogRepository;

    public Iterable<JobLog> saveAll(Iterable<JobLog> jobLogs) {
        return jobLogRepository.saveAll(jobLogs);
    }
    public Iterable<JobLog> getAllByJobId(Integer jobId) {
        return jobLogRepository.findAllByJobId(jobId);
    }
    public JobLog update(JobLog jobLog) {
        return jobLogRepository.save(jobLog);
    }
    public Optional<JobLog> getJobLogById(Integer id) {
        return jobLogRepository.findById(id);
    }
}
