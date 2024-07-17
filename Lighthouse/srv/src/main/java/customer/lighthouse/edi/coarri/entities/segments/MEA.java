package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class MEA {

    private String measurementApplicationQualifier_6311;

    @Getter
    @Setter
    @Component
    public static class MeasurementDetails_C502 {
        @JsonAlias("e6313")
        private String measurementDimensionCoded_6313;
        @JsonAlias("e6321")
        private String measurementSignificanceCoded_6321;
        @JsonAlias("e6155")
        private String measurementAttributeCoded_6155;
        @JsonAlias("e6154")
        private String measurementAttribute_6154;
    }

    @JsonAlias("c502")
    private MeasurementDetails_C502 measurementDetails_C502;

    @Getter
    @Setter
    @Component
    public static class ValueRange_C174 {
        @JsonAlias("e6411")
        private String measureUnitQualifier_6411;
        @JsonAlias("e6314")
        private String measurementValue_6314;
        @JsonAlias("e6162")
        private String rangeMinimum_6162;
        @JsonAlias("e6152")
        private String rangeMaximum_6152;
        @JsonAlias("e6432")
        private String significantDigits_6432;
    }

    @JsonAlias("c174")
    private ValueRange_C174 valueRange_C174;

    @JsonAlias("e7383")
    private String surfaceLayerIndicatorCoded_7383;
}
