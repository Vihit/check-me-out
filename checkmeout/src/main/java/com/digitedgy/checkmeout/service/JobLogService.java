package com.digitedgy.checkmeout.service;

import com.digitedgy.checkmeout.entity.JobLog;
import com.digitedgy.checkmeout.repository.JobLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class JobLogService {

    @Autowired
    JobLogRepository jobLogRepository;

    public Iterable<JobLog> saveAll(Iterable<JobLog> jobLogs) {
        return jobLogRepository.saveAll(jobLogs);
    }
}
