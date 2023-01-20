DROP TRIGGER IF EXISTS trg_audit_create_checklist^;

CREATE TRIGGER trg_audit_create_checklist
AFTER INSERT ON checklist FOR EACH ROW
BEGIN
	declare V_ACTION VARCHAR(255);
	declare V_PK_VALUE VARCHAR(255);
	declare V_TYPE VARCHAR(255);
	declare V_PREV_STATE TEXT;
	declare V_USERNAME VARCHAR(255);
	declare V_NEW_STATE TEXT;
	SET V_ACTION = 'CREATED';
	SET V_PK_VALUE = New.id;
	SET V_TYPE = 'CHECKLIST';
	SET V_PREV_STATE = null;
	SET V_USERNAME = New.created_by;

	IF V_USERNAME is NULL THEN
	SET V_USERNAME = 'SYSTEM';
	END IF;

	SET V_NEW_STATE = concat('Name: ',NEW.name,' State: ',NEW.state);

	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,V_ACTION,V_PREV_STATE, V_NEW_STATE, V_USERNAME);
END; ^;

DROP TRIGGER IF EXISTS trg_audit_update_checklist ^;

CREATE TRIGGER trg_audit_update_checklist
AFTER UPDATE ON checklist FOR EACH ROW
BEGIN
	declare V_ACTION VARCHAR(255);
	declare V_PK_VALUE INT;
	declare V_TYPE VARCHAR(255);
	declare V_PREV_STATE TEXT;
	declare V_USERNAME VARCHAR(255);
	declare V_NEW_STATE TEXT;
	declare V_CHECK INT;
	SET V_ACTION = 'UPDATED';
	SET V_PK_VALUE = NEW.id;
	SET V_TYPE = 'CHECKLIST';
	SET V_USERNAME = NEW.review_by;
	SET V_PREV_STATE = '';
	SET V_NEW_STATE = '';
	IF NEW.name <> OLD.name THEN
	SET V_PREV_STATE = concat(V_PREV_STATE,'Name: ',OLD.name,' ');
	SET V_NEW_STATE = concat(V_NEW_STATE,'Name: ',NEW.name,' ');
	END IF;
	IF NEW.change_control_reference <> OLD.change_control_reference THEN
	SET V_PREV_STATE = concat(V_PREV_STATE,'Change Control Reference: ',OLD.change_control_reference,' ');
	SET V_NEW_STATE = concat(V_NEW_STATE,'Change Control Reference: ',NEW.change_control_reference,' ');
	END IF;
    IF NEW.equipment_type <> OLD.equipment_type THEN
    SET V_PREV_STATE = concat(V_PREV_STATE,' Equipment Type: ',OLD.equipment_type);
    SET V_NEW_STATE = concat(V_NEW_STATE,' Equipment Type: ',NEW.equipment_type);
    END IF;
    IF NEW.sop_number <> OLD.sop_number THEN
    SET V_PREV_STATE = concat(V_PREV_STATE,' SOP.No. ',OLD.sop_number);
    SET V_NEW_STATE = concat(V_NEW_STATE,' SOP.No.: ',NEW.sop_number);
    END IF;
    IF NEW.state <> OLD.state THEN
    SET V_PREV_STATE = concat(V_PREV_STATE,' State. ',OLD.state);
    SET V_NEW_STATE = concat(V_NEW_STATE,' State: ',NEW.state);
    END IF;
    IF NEW.type <> OLD.type THEN
    SET V_PREV_STATE = concat(V_PREV_STATE,' Type. ',OLD.type);
    SET V_NEW_STATE = concat(V_NEW_STATE,' Type: ',NEW.type);
    END IF;
	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,V_ACTION,V_PREV_STATE, V_NEW_STATE, V_USERNAME);

END; ^;

DROP TRIGGER IF EXISTS trg_audit_create_job^;

CREATE TRIGGER trg_audit_create_job
AFTER INSERT ON job FOR EACH ROW
BEGIN
	declare V_ACTION VARCHAR(255);
	declare V_PK_VALUE VARCHAR(255);
	declare V_TYPE VARCHAR(255);
	declare V_PREV_STATE TEXT;
	declare V_USERNAME VARCHAR(255);
	declare V_NEW_STATE TEXT;
	SET V_ACTION = 'CREATED';
	SET V_PK_VALUE = New.id;
	SET V_TYPE = 'JOB';
	SET V_PREV_STATE = null;
	SET V_USERNAME = New.created_by;

	IF V_USERNAME is NULL THEN
	SET V_USERNAME = 'SYSTEM';
	END IF;

	SET V_NEW_STATE = concat('ID: ',NEW.id,' Checklist ID: ',NEW.checklist_id,' Equipment Name: ',NEW.equipment_name);

	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,V_ACTION,V_PREV_STATE, V_NEW_STATE, V_USERNAME);
END; ^;

DROP TRIGGER IF EXISTS trg_audit_update_job ^;

CREATE TRIGGER trg_audit_update_job
AFTER UPDATE ON job FOR EACH ROW
BEGIN
	declare V_ACTION VARCHAR(255);
	declare V_PK_VALUE INT;
	declare V_TYPE VARCHAR(255);
	declare V_PREV_STATE TEXT;
	declare V_USERNAME VARCHAR(255);
	declare V_NEW_STATE TEXT;
	declare V_CHECK INT;
	SET V_ACTION = 'UPDATED';
	SET V_PK_VALUE = NEW.id;
	SET V_TYPE = 'JOB';
	SET V_USERNAME = NEW.updated_by;
	SET V_PREV_STATE = '';
	SET V_NEW_STATE = '';
	SET V_CHECK = 0;
	IF coalesce(NEW.started_on,'') <> coalesce(OLD.started_on,'') THEN
	SET V_CHECK = 1;
	SET V_PREV_STATE = concat(V_PREV_STATE,'Started On: ',coalesce(OLD.started_on,''));
	SET V_NEW_STATE = concat(V_NEW_STATE,'Started On: ',coalesce(NEW.started_on,''));
	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,'STARTED',V_PREV_STATE, V_NEW_STATE, V_USERNAME);
	END IF;
	IF coalesce(NEW.completed_on,'') <> coalesce(OLD.completed_on,'') THEN
	SET V_CHECK = 1;
	SET V_NEW_STATE = concat('Job: ',NEW.id);
	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,'COMPLETED',V_PREV_STATE, V_NEW_STATE, V_USERNAME);
	END IF;
	IF V_CHECK = 0 THEN
	SET V_PREV_STATE = concat(V_PREV_STATE,'');
	SET V_NEW_STATE = concat(V_NEW_STATE,'Task performed on Job!');
	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,V_ACTION,V_PREV_STATE, V_NEW_STATE, V_USERNAME);
	END IF;

END; ^;

DROP TRIGGER IF EXISTS trg_audit_update_job_log ^;

CREATE TRIGGER trg_audit_update_job_log
AFTER UPDATE ON job_log FOR EACH ROW
BEGIN
	declare V_ACTION VARCHAR(255);
	declare V_PK_VALUE INT;
	declare V_TYPE VARCHAR(255);
	declare V_PREV_STATE TEXT;
	declare V_USERNAME VARCHAR(255);
	declare V_NEW_STATE TEXT;
	declare V_CHECK INT;
	SET V_ACTION = 'UPDATED';
	SET V_PK_VALUE = NEW.id;
	SET V_TYPE = 'JOB_LOG';
	SET V_USERNAME = NEW.updated_by;
	SET V_PREV_STATE = '';
	SET V_NEW_STATE = '';
	SET V_CHECK = 0;
	IF coalesce(NEW.started_on,'') <> coalesce(OLD.started_on,'') THEN
	SET V_CHECK = 1;
	SET V_NEW_STATE = concat('Job: ',NEW.job_id,' Stage: ',NEW.stage_id,' Task: ',NEW.task_id);
	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,'STARTED',V_PREV_STATE, V_NEW_STATE, V_USERNAME);
	END IF;
	IF coalesce(NEW.comments,'') <> coalesce(OLD.comments,'') THEN
	SET V_CHECK = 1;
	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,'COMMENTED',V_PREV_STATE, 'User added a comment!', V_USERNAME);
	END IF;
	IF coalesce(NEW.task_activity,'') <> coalesce(OLD.task_activity,'') THEN
	SET V_CHECK = 1;
	SET V_NEW_STATE = concat('Stage: ',NEW.stage_id,' Task: ',NEW.task_id,' | ',NEW.task_activity);
	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,'ACTED',V_PREV_STATE, V_NEW_STATE, V_USERNAME);
	END IF;
	IF coalesce(NEW.completed_on,'') <> coalesce(OLD.completed_on,'') THEN
	SET V_CHECK = 1;
	SET V_NEW_STATE = concat(V_NEW_STATE,'Job: ',NEW.job_id,' Stage: ',NEW.stage_id,' Task: ',NEW.task_id);
	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,'COMPLETED',V_PREV_STATE, V_NEW_STATE, V_USERNAME);
	END IF;
	IF V_CHECK = 0 THEN
	SET V_NEW_STATE = concat(V_NEW_STATE,'Job: ',NEW.job_id,' Stage: ',NEW.stage_id,' Task: ',NEW.task_id);
	insert into checkmeout_audit_trail (type,pk_value,action,prev_state,new_state,username) values (V_TYPE, V_PK_VALUE,'ACTED ON JOB',V_PREV_STATE, V_NEW_STATE, V_USERNAME);
	END IF;
END; ^;