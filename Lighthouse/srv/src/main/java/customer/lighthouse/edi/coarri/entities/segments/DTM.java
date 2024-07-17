package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class DTM {

    @Getter
    @Setter
    @Component
    // Inner class for DateTimePeriod_C507
    public class DateTimePeriod_C507 {
        @JsonAlias("e2005")
        private String dateTimePeriodQualifier_2005;
        @JsonAlias("e2380")
        private String dateTimePeriod_2380;
        @JsonAlias("e2379")
        private String dateTimePeriodFormatQualifier_2379;
    }

    @JsonAlias("c507")
    private DateTimePeriod_C507 dateTimePeriod_C507;
}
