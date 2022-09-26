package com.digitedgy.checkmeout.controller;

import com.digitedgy.checkmeout.entity.Checklist;
import com.digitedgy.checkmeout.service.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/master/equipment/")
public class EquipmentController {

    @Autowired
    EquipmentService equipmentService;

    @GetMapping("/types/")
    public ResponseEntity<?> getTypes() {
        return new ResponseEntity<>(equipmentService.getTypes(), HttpStatus.OK);
    }

    @GetMapping("/names/{type}")
    public ResponseEntity<?> getNamesFor(@PathVariable(name = "type") String type) {
        return new ResponseEntity<>(equipmentService.getNamesForType(type), HttpStatus.OK);
    }
}
