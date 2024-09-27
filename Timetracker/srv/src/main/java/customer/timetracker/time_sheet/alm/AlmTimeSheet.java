package customer.timetracker.time_sheet.alm;

import java.sql.Date;
import java.sql.Time;
import javax.persistence.*;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@SuppressWarnings("serial")
@Getter
@Setter
@Component
@Entity
@JsonIgnoreProperties(ignoreUnknown = true)
@SqlResultSetMapping(name = "Alm_TimeSheet_Mapping", entities = { 
    @EntityResult(entityClass = AlmTimeSheet.class, fields = {
    @FieldResult(name = "id",  column = "id"),
    @FieldResult(name = "projectId", column = "projectId"),
    @FieldResult(name = "title", column = "title"),
    @FieldResult(name = "type", column = "type"),
    @FieldResult(name = "projectName", column = "projectName"),
    @FieldResult(name = "startDate", column = "startDate"),
    @FieldResult(name = "dueDate", column = "dueDate"),
    @FieldResult(name = "priorityText", column = "priorityText"),
    @FieldResult(name = "mPTStatus", column = "mPTStatus"),
    @FieldResult(name = "duration", column = "duration"),
    @FieldResult(name = "billable", column = "billable"),
    @FieldResult(name = "location", column = "location"),
    @FieldResult(name = "startTime", column = "startTime"),
    @FieldResult(name = "createdBy", column = "createdBy"),
    @FieldResult(name = "updatedBy", column = "updatedBy"),
    @FieldResult(name = "createdOn", column = "createdOn"),
    @FieldResult(name = "updatedOn", column = "updatedOn"),
    @FieldResult(name = "assignedTo", column = "assignedTo"),
    @FieldResult(name = "endTime", column = "endTime"),
    @FieldResult(name = "status", column = "status"),
    @FieldResult(name = "userStatus", column = "userStatus"),
    @FieldResult(name = "timeStatus", column = "timeStatus"),
    @FieldResult(name = "remarks", column = "remarks"),
    @FieldResult(name = "lastChangedDate", column = "lastChangedDate"),
    @FieldResult(name = "description", column = "description"),
    @FieldResult(name = "activity", column = "activity"),
    @FieldResult(name = "recordCount", column = "recordCount")
})
})
public class AlmTimeSheet {
    @Id
    private Long id;
    private String projectId;
    private String title;
    private String type;
    private String projectName;
    private Date startDate;
    private Date dueDate;
    private String priorityText;
    private String mPTStatus;
    private String createdBy;
    private String updatedBy;
    private Date createdOn;
    private Date updatedOn;
    private String location;
    private Time duration;
    private String billable;
    private String startTime;
    private Integer userStatus;
    private String status;
    private String assignedTo;
    private String endTime;
    private String remarks;
    private Integer recordCount;
    private Integer timeStatus;
    private Date lastChangedDate;
    private Integer activity;
    private String description;
}
