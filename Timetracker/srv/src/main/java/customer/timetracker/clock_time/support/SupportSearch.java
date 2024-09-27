package customer.timetracker.clock_time.support;

import java.util.Date;
import java.util.List;

// import org.hibernate.query.criteria.internal.predicate.BooleanAssertionPredicate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Component
@Getter
@Setter
public class SupportSearch {
    @JsonProperty("ObjectId")
    private String ObjectId;
    @JsonProperty("SoldToParty")
    private String SoldToParty;
    @JsonProperty("SoldToName")
    private String SoldToName;
    @JsonProperty("Description")
    private String Description;
    @JsonProperty("CreatedAtDateFormatted")
    private String CreatedAtDateFormatted;
    @JsonProperty("PriorityTxt")
    private String PriorityTxt;
    @JsonProperty("Priority")
    private String Priority;
    @JsonProperty("UserStatusDescription")
    private String UserStatusDescription;
    @JsonProperty("MPTPercentage")
    private String MPTPercentage;
    @JsonProperty("CategoryTxt")
    private String CategoryTxt;
    @JsonProperty("DescriptiveStatusCode")
    private String DescriptiveStatusCode;
    @JsonProperty("TimeFrameId")
    private String TimeFrameId;
    @JsonProperty("PostingDate")
    private String PostingDate;
    @JsonProperty("PersonRespName")
    private String PersonRespName;
    private Integer pagingEnabled = 0; // 0 false 1 true
    private Integer top = 100;
    private Integer pageSize = 0;
    private Integer skip = 0;
    private String sort;
}
