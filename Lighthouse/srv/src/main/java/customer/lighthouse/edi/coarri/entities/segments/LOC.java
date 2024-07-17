package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class LOC {

    // Segment structure
    private String placeLocationQualifier_3227;

    @Getter
    @Setter
    @Component
    public static class LocationIdentification_C517 {
        @JsonAlias("e3225")
        private String placeLocationIdentification_3225;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e3224")
        private String placeLocation_3224;
    }

    @JsonAlias("c517")
    private LocationIdentification_C517 locationIdentification_C517;

    @Getter
    @Setter
    @Component
    public static class RelatedLocationOneIdentification_C519 {
        @JsonAlias("e3223")
        private String relatedPlaceLocationOneIdentification_3223;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e3222")
        private String relatedPlaceLocationOne_3222;
    }

    @JsonAlias("c519")
    private RelatedLocationOneIdentification_C519 relatedLocationOneIdentification_C519;

    @Getter
    @Setter
    @Component
    public static class RelatedLocationTwoIdentification_C553 {
        @JsonAlias("e3233")
        private String relatedPlaceLocationTwoIdentification_3233;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e3232")
        private String relatedPlaceLocationTwo_3232;
    }

    @JsonAlias("c553")
    private RelatedLocationTwoIdentification_C553 relatedLocationTwoIdentification_C553;

    @JsonAlias("e5479")
    private String relationCoded_5479;
}
