package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class EQD {

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

    @Getter
    @Setter
    @Component
    public static class EquipmentSizeAndType_C224 {
        @JsonAlias("e8155")
        private String equipmentSizeAndTypeIdentification_8155;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e8154")
        private String equipmentSizeAndType_8154;
    }

    @JsonAlias("c237")
    private EquipmentIdentification_C237 equipmentIdentification_C237;
    @JsonAlias("c224")
    private EquipmentSizeAndType_C224 equipmentSizeAndType_C224;
    @JsonAlias("e8077")
    private String equipmentSupplierCoded_8077;
    @JsonAlias("e8249")
    private String equipmentStatusCoded_8249;
    @JsonAlias("e8169")
    private String fullEmptyIndicatorCoded_8169;
}
