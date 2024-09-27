package customer.timetracker.clock_time.implementation;

import java.util.List;


import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Component
@Getter
@Setter
public class Implementation {
    @JsonProperty("id")
    private String id;
    @JsonProperty("name")
    private String name;
    @JsonProperty("title")
    private String title;
    @JsonProperty("type")
    private String type;
    @JsonProperty("priorityId")
    private String priorityId;
    @JsonProperty("purpose")
    private String purpose;
    @JsonProperty("operationalStatus")
    private String operationalStatus;

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
}
