package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class SEL {

    @JsonAlias("e9308")
    private String sealNumber_9308;

    @Getter
    @Setter
    @Component
    public static class SealIssuer_C215 {
        @JsonAlias("e9303")
        private String sealingPartyCoded_9303;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e9302")
        private String sealingParty_9302;
    }

    @JsonAlias("c215")
    private SealIssuer_C215 sealIssuer_C215;

    @JsonAlias("e4517")
    private String sealConditionCoded_4517;
}
