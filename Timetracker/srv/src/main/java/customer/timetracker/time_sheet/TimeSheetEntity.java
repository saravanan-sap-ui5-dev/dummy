package customer.timetracker.time_sheet;

import java.sql.Date;
import java.sql.Time;
import javax.persistence.Id;
import javax.persistence.Entity;
import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@SuppressWarnings("serial")
@Getter
@Setter
@Component

@JsonIgnoreProperties(ignoreUnknown = true)
public class TimeSheetEntity {
    
    private Long id;
    private String soldToName;
    private String soldToParty;
    private String objectId;
    private String description;
    private String descriptionText;
    private Date postingDate;
    private String priorityText;
    private String userStatusDescription;
    private String mPTStatus;
    private Time duration;
    private Integer activity;
    private String categoryTxt;
    private Integer status;
    private String createdBy;
    private String location;
    private String updatedBy;
    private Date createdOn;
    private Date updatedOn;
    private String startTime;
    private String endTime;
    private String remarks;
    private String personRespName;
    private Long timeStatus;
    private Date lastChangedDate;
    private String lastChangedStart;
    private String lastChangedEnd;
    private String createdOnStart;
    private String updatedOnStart;
    private String createdOnEnd;
    private String updatedOnEnd;
    private String sortingKey;
    private String orderBy;
    private Boolean stringType;
    private Integer pageNumber = 0;
    private Integer pageSize = 0;
}
