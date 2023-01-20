package com.digitedgy.checkmeout.service;

import com.digitedgy.checkmeout.entity.AuditTrail;
import com.digitedgy.checkmeout.repository.AuditTrailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditTrailService {

    @Autowired
    AuditTrailRepository auditTrailRepository;

    public Iterable<AuditTrail> getAllForPkValueAndType(String type,String[] pkValue) {
        return auditTrailRepository.findAllByTypeAndPkValueIn(type,pkValue);
    }
}
