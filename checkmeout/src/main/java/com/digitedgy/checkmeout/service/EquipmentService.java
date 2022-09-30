package com.digitedgy.checkmeout.service;

import com.digitedgy.checkmeout.model.DataQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentService {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Value("${master.equipment.table}")
    private String table;
    @Value("${master.equipment.table.type.col}")
    private String typeCol;
    @Value("${master.equipment.table.name.col}")
    private String nameCol;

    public List<DataQuery> getTypes() {
        return jdbcTemplate.query("select distinct "+typeCol+" from "+table,(resultSet, rowNum) -> new DataQuery(resultSet, typeCol.split(",")));
    }

    public List<DataQuery> getNamesForType(String type) {
        return jdbcTemplate.query("select distinct id, "+nameCol+" from "+table+" where "+typeCol+"='"+type+"'",(resultSet, rowNum) -> new DataQuery(resultSet, ("id,"+nameCol).split(",")));
    }
}
