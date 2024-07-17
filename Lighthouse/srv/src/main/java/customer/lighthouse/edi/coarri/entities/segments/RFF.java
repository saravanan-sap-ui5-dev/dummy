package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

// Inner class for RFF
@Getter
@Setter
@Component
public class RFF {

    // Inner class for C506 Reference
    @Getter
    @Setter
    @Component
    public static class Reference_C506 {
        @JsonAlias("e1153")
        private String referenceQualifier_1153;
        @JsonAlias("e1154")
        private String referenceNumber_1154;
        @JsonAlias("e1156")
        private String lineNumber_1156;
        @JsonAlias("e4000")
        private String referenceVersionNumber_4000;
    }

    @JsonAlias("c506")
    private Reference_C506 reference_C506;

}