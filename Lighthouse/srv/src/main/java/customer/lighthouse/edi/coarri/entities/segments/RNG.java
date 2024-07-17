package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class RNG {

    private String rangeTypeQualifier_6167;

    @Getter
    @Setter
    @Component
    public static class Range_C280 {
        @JsonAlias("e6411")
        private String measureUnitQualifier_6411;
        @JsonAlias("e6162")
        private String rangeMinimum_6162;
        @JsonAlias("e6152")
        private String rangeMaximum_6152;
    }

    @JsonAlias("c280")
    private Range_C280 range_C280;
}
