package customer.timetracker.time_sheet.miscellaneous;

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
@SqlResultSetMapping(name = "Miscellaneous_Mapping", entities = { 
    @EntityResult(entityClass = Miscellaneous.class, fields = {
    @FieldResult(name = "id",  column = "id"),
    @FieldResult(name = "soldToName", column = "soldToName"),
    @FieldResult(name = "soldToParty", column = "soldToParty"),
    @FieldResult(name = "remarks", column = "remarks"),
    @FieldResult(name = "description", column = "description"),
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
    @FieldResult(name = "timeStatus", column = "timeStatus"), 
    @FieldResult(name = "lastChangedDate", column = "lastChangedDate"),
    @FieldResult(name = "recordCount", column = "recordCount")
})
})
public class Miscellaneous {
    @Id
    private Long id;
    private String soldToName;
    private String soldToParty;
    private String remarks;
    private String description;
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
    private Long timeStatus;
    private Date lastChangedDate;
    private Integer recordCount;
}
