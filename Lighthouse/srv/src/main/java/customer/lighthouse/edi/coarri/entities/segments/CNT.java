package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class CNT {

    // Inner class for C270 Control
    @Getter
    @Setter
    @Component
    public static class Control_C270 {
        @JsonAlias("e6069")
        private String controlTotalTypeCodeQualifier_6069;
        @JsonAlias("e6066")
        private long controlTotalQuantity_6066;
        @JsonAlias("e6411")
        private String measurementUnitCode_6411;
    }

    @JsonAlias("c270")
    private Control_C270 control_C270;
}
