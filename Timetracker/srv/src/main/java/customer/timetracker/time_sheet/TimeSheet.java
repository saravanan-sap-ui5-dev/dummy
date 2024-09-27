package customer.timetracker.time_sheet;

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
@SqlResultSetMapping(name = "TimeSheet_Mapping", entities = { 
    @EntityResult(entityClass = TimeSheet.class, fields = {
    @FieldResult(name = "id",  column = "id"),
    @FieldResult(name = "soldToName", column = "soldToName"),
    @FieldResult(name = "soldToParty", column = "soldToParty"),
    @FieldResult(name = "personRespName", column = "personRespName"),
    @FieldResult(name = "objectId", column = "objectId"),
    @FieldResult(name = "description", column = "description"),
    @FieldResult(name = "descriptionText", column = "descriptionText"),
    @FieldResult(name = "postingDate", column = "postingDate"),
    @FieldResult(name = "priorityText", column = "priorityText"),
    @FieldResult(name = "userStatusDescription", column = "userStatusDescription"),
    @FieldResult(name = "mPTStatus", column = "mPTStatus"),
    @FieldResult(name = "createdBy", column = "createdBy"),
    @FieldResult(name = "location", column = "location"),
    @FieldResult(name = "updatedBy", column = "updatedBy"),
    @FieldResult(name = "createdOn", column = "createdOn"),
    @FieldResult(name = "updatedOn", column = "updatedOn"),
    @FieldResult(name = "duration", column = "duration"),
    @FieldResult(name = "activity", column = "activity"),
    @FieldResult(name = "categoryTxt", column = "categoryTxt"),
    @FieldResult(name = "status", column = "status"),
    @FieldResult(name = "timeStatus", column = "timeStatus"),
    @FieldResult(name = "startTime", column = "startTime"),
    @FieldResult(name = "endTime", column = "endTime"),
    @FieldResult(name = "remarks", column = "remarks"),
    @FieldResult(name = "lastChangedDate", column = "lastChangedDate"),
    @FieldResult(name = "recordCount", column = "recordCount")
})
})
public class TimeSheet {
    @Id
    private Long id;
    private String soldToName;
    private String soldToParty;
    private String personRespName;
    private String objectId;
    private String description;
    private String descriptionText;
    private Date postingDate;
    private String priorityText;
    private String userStatusDescription;
    private String mPTStatus;
    private String createdBy;
    private String location;
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
    private Integer recordCount;
    private Long timeStatus;
    private Date lastChangedDate;
}
