package customer.timetracker.time_sheet;
import java.sql.Time;
import java.util.Date;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.EntityResult;
import javax.persistence.FieldResult;
import javax.persistence.Id;
import javax.persistence.SqlResultSetMapping;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

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
@SqlResultSetMapping(name = "TimeSheetDetails_Mapping", entities = { 
    @EntityResult(entityClass = TimeSheetDetails.class, fields = {
    @FieldResult(name = "id",  column = "id"),
    @FieldResult(name = "soldToName", column = "soldToName"),
    @FieldResult(name = "soldToParty", column = "soldToParty"),
    @FieldResult(name = "objectId", column = "objectId"),
    @FieldResult(name = "description", column = "description"),
    @FieldResult(name = "postingDate", column = "postingDate"),
    @FieldResult(name = "priorityText", column = "priorityText"),
    @FieldResult(name = "userStatusDescription", column = "userStatusDescription"),
    @FieldResult(name = "mPTStatus", column = "mPTStatus"),
    @FieldResult(name = "createdBy", column = "createdBy"),
    @FieldResult(name = "updatedBy", column = "updatedBy"),
    @FieldResult(name = "createdOn", column = "createdOn"),
    @FieldResult(name = "updatedOn", column = "updatedOn"),
    @FieldResult(name = "duration", column = "duration"),
    @FieldResult(name = "activity", column = "activity"),
    @FieldResult(name = "categoryTxt", column = "categoryTxt"),
    @FieldResult(name = "status", column = "status"),
    @FieldResult(name = "startTime", column = "startTime"),
    @FieldResult(name = "endTime", column = "endTime"),
    @FieldResult(name = "remarks", column = "remarks"),
    @FieldResult(name = "timeStatus", column = "timeStatus"),
    @FieldResult(name = "lastChangedDate", column = "lastChangedDate")
})
})
public class TimeSheetDetails {
    @Id
    private Long id;
    private String soldToName;
    private String soldToParty;
    private String objectId;
    private String description;
    private Date postingDate;
    private String priorityText;
    private String userStatusDescription;
    private String mPTStatus;
    private String createdBy;
    private String updatedBy;
    private Date createdOn;
    private Date updatedOn;
    private Time duration;
    private Integer activity;
    private String categoryTxt;
    private Integer status;
    private String startTime;
    private String endTime;
    private String remarks;
    private Long timeStatus;
    private Date lastChangedDate;

    
}
