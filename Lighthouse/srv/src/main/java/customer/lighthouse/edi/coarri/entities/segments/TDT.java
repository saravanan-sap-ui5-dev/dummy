package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

// Inner class for TDT
@Getter
@Setter
@Component
public class TDT {

    // Inner class for C220 Mode of transport
    @Getter
    @Setter
    @Component
    public static class ModeOfTransport_C220 {
        @JsonAlias("e8067")
        private String transportModeCoded_8067;
        @JsonAlias("e8066")
        private String transportMode_8066;
    }

    // Inner class for C001 Transport means
    @Getter
    @Setter
    @Component
    public static class TransportMeans_C228 {
        @JsonAlias("e8179")
        private String typeOfMeansOfTransportIdentification_8179;
        /*
         * private String codeListIdentificationCode_1131;
         * private String codeListResponsibleAgencyCode_3055;
         */
        @JsonAlias("e8178")
        private String typeOfMeansOfTransport_8178;
    }

    // Inner class for C040 Carrier
    @Getter
    @Setter
    @Component
    public static class Carrier_C040 {
        @JsonAlias("e3127")
        private String carrierIdentifier_3127;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e3128")
        private String carrierName_3128;
    }

    // Inner class for C401 Excess transportation information
    @Getter
    @Setter
    @Component
    public static class ExcessTransportationInformation_C401 {
        @JsonAlias("e8457")
        private String excessTransportationReasonCoded_8457;
        @JsonAlias("e8459")
        private String excessTransportationResponsibilityCoded_8459;
        @JsonAlias("e7130")
        private String customerAuthorisationNumber_7130;
    }

    // Inner class for C222 Transport identification
    @Getter
    @Setter
    @Component
    public static class TransportIdentification_C222 {
        @JsonAlias("e8213")
        private String idOfMeansOfTransportIdentification_8213;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e8212")
        private String idOfTheMeansOfTransportCoded_8212;
        @JsonAlias("e8453")
        private String nationalityOfMeansOfTransportCoded_8453;
    }

    @JsonAlias("e8051")
    private String transportStageQualifier_8051;
    @JsonAlias("e8028")
    private String conveyanceReferenceNumber_8028;
    @JsonAlias("c220")
    private ModeOfTransport_C220 modeOfTransport_C220;
    @JsonAlias("c228")
    private TransportMeans_C228 transportMeans_C228;
    @JsonAlias("c040")
    private Carrier_C040 carrier_C040;
    @JsonAlias("e8101")
    private String transitDirectionCoded_8101;
    @JsonAlias("c401")
    private ExcessTransportationInformation_C401 excessTransportationInformation_C401;
    @JsonAlias("c222")
    private TransportIdentification_C222 transportIdentification_C222;
    @JsonAlias("e8281")
    private String transportOwnershipCoded_8281;
}
