package customer.timetracker.clock_time.support;

import java.util.List;


import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Component
@Getter
@Setter
public class Support {
    @JsonProperty("SoldToName")
    private String SoldToName;
    @JsonProperty("ObjectId")
    private String ObjectId;
    @JsonProperty("SoldToParty")
    private String SoldToParty;
    @JsonProperty("Description")
    private String Description;
    @JsonProperty("CreatedAtDateFormatted")
    private String CreatedAtDateFormatted;
    @JsonProperty("PriorityTxt")
    private String PriorityTxt;
    @JsonProperty("UserStatusDescription")
    private String UserStatusDescription;
    @JsonProperty("MPTPercentage")
    private String MPTPercentage;
    @JsonProperty("CategoryTxt")
    private String CategoryTxt;
    @JsonProperty("PersonRespName")
    private String PersonRespName;
  
}