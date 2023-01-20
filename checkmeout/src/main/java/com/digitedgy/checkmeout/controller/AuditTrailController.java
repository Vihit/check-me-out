package com.digitedgy.checkmeout.controller;

import com.digitedgy.checkmeout.service.AuditTrailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/audit-trail/")
public class AuditTrailController {

    @Autowired
    AuditTrailService auditTrailService;

    @GetMapping("/")
    public ResponseEntity<?> getAuditTrailForPkValueAndType(@RequestParam String pkValues, @RequestParam String type) {
        System.out.println(type);
        return new ResponseEntity<>(auditTrailService.getAllForPkValueAndType(type,pkValues.split(",")), HttpStatus.OK);
    }

}
