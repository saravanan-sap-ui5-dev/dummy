package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class EQA {

    @JsonAlias("e8053")
    private String equipmentQualifier_8053;

    @Getter
    @Setter
    @Component
    public static class EquipmentIdentification_C237 {
        @JsonAlias("e8260")
        private String equipmentIdentificationNumber_8260;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e3207")
        private String countryCoded_3207;
    }

    @JsonAlias("c237")
    private EquipmentIdentification_C237 equipmentIdentification_C237;
}
