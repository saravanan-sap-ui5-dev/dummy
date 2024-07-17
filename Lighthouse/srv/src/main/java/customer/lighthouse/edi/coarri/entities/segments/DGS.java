package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class DGS {

    @JsonAlias("e8273")
    private String dangerousGoodsRegulationsCoded_8273;

    @Getter
    @Setter
    @Component
    public static class HazardCode_C205 {
        @JsonAlias("e8351")
        private String hazardCodeIdentification_8351;
        @JsonAlias("e8078")
        private String hazardSubstanceItemPageNumber_8078;
        @JsonAlias("e8092")
        private String hazardCodeVersionNumber_8092;
    }

    @JsonAlias("c205")
    private HazardCode_C205 hazardCode_C205;

    @Getter
    @Setter
    @Component
    public static class UNDGInformation_C234 {
        @JsonAlias("e7124")
        private String undgNumber_7124;
        @JsonAlias("e7088")
        private String dangerousGoodsFlashpoint_7088;
    }

    @JsonAlias("c234")
    private UNDGInformation_C234 undgInformation_C234;

    @Getter
    @Setter
    @Component
    public static class DangerousGoodsShipmentFlashpoint_C223 {
        @JsonAlias("e7106")
        private String shipmentFlashpoint_7106;
        @JsonAlias("e6411")
        private String measureUnitQualifier_6411;
    }

    @JsonAlias("c223")
    private DangerousGoodsShipmentFlashpoint_C223 dangerousGoodsShipmentFlashpoint_C223;

    @JsonAlias("e8339")
    private String packingGroupCoded_8339;

    @JsonAlias("e8364")
    private String emsNumber_8364;

    @JsonAlias("e8410")
    private String mfag_8410;

    @JsonAlias("e8126")
    private String tremCardNumber_8126;

    @Getter
    @Setter
    @Component
    public static class HazardIdentification_C235 {
        @JsonAlias("e8158")
        private String hazardIdentificationNumberUpperPart_8158;
        @JsonAlias("e8186")
        private String substanceIdentificationNumberLowerPart_8186;
    }

    @JsonAlias("c235")
    private HazardIdentification_C235 hazardIdentification_C235;

    @Getter
    @Setter
    @Component
    public static class DangerousGoodsLabel_C236 {
        @JsonAlias("e8246")
        private String dangerousGoodsLabelMarking1_8246;
        @JsonAlias("e8246")
        private String dangerousGoodsLabelMarking2_8246;
        @JsonAlias("e8246")
        private String dangerousGoodsLabelMarking3_8246;
    }

    @JsonAlias("c236")
    private DangerousGoodsLabel_C236 dangerousGoodsLabel_C236;

    @JsonAlias("e8255")
    private String packingInstructionCoded_8255;

    @JsonAlias("e8325")
    private String categoryOfMeansOfTransportCoded_8325;

    @JsonAlias("e8211")
    private String permissionForTransportCoded_8211;
}
