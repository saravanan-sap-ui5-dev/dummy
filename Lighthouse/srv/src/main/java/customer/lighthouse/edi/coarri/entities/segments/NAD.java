package customer.lighthouse.edi.coarri.entities.segments;

import java.util.List;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class NAD {

    @JsonAlias("e3035")
    private String partyQualifier_3035;

    @Getter
    @Setter
    @Component
    public static class PartyIdentificationDetails_C082 {
        @JsonAlias("e3039")
        private String partyIdIdentification_3039;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
    }

    @JsonAlias("c082")
    private PartyIdentificationDetails_C082 partyIdentificationDetails_C082;

    @Getter
    @Setter
    @Component
    public static class NameAndAddress_C058 {
        @JsonAlias("e3124")
        private List<String> nameAndAddressLine_3124;
    }

    @JsonAlias("c058")
    private NameAndAddress_C058 nameAndAddress_C058;

    @Getter
    @Setter
    @Component
    public static class PartyName_C080 {
        @JsonAlias("e3036")
        private List<String> partyName_3036;
        @JsonAlias("e3045")
        private String partyNameFormatCoded_3045;
    }

    @JsonAlias("c080")
    private PartyName_C080 partyName_C080;

    @Getter
    @Setter
    @Component
    public static class Street_C059 {
        @JsonAlias("e3042")
        private List<String> streetAndNumberOrPOBox_3042;
    }

    @JsonAlias("c059")
    private Street_C059 street_C059;

    @JsonAlias("e3164")
    private String cityName_3164;
    @JsonAlias("e3229")
    private String countrySubEntityIdentification_3229;
    @JsonAlias("e3251")
    private String postcodeIdentification_3251;
    @JsonAlias("e3207")
    private String countryCoded_3207;
}
