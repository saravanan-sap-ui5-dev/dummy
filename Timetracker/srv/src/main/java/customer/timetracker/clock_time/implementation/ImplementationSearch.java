package customer.timetracker.clock_time.implementation;

import java.util.List;

// import org.hibernate.query.criteria.internal.predicate.BooleanAssertionPredicate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Component
@Getter
@Setter

public class ImplementationSearch {
     @JsonProperty("id")
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("purpose")
    private String purpose;
    @JsonProperty("operationalStatus")
    private String operationalStatus;
    @JsonProperty("PriorityTxt")
    private String PrnameiorityTxt;
    @JsonProperty("assigneeId")
    private String assigneeId;
    @JsonProperty("assigneeName")
    private String assigneeName;
    @JsonProperty("startDate")
    private String startDate;
    @JsonProperty("dueDate")
    private String dueDate;
    @JsonProperty("status")
    private String status;
    @JsonProperty("title")
    private String title;
    @JsonProperty("type")
    private String type;
    @JsonProperty("priorityId")
    private String priorityId;
    private Integer pagingEnabled = 0; // 0 false 1 true
    private Integer top = 100;
    private Integer pageSize = 0;
    private Integer skip = 0;
    private String sort;
}
