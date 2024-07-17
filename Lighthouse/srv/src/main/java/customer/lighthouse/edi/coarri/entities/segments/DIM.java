package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class DIM {

    private String dimensionQualifier_6145;

    @Getter
    @Setter
    @Component
    public static class Dimensions_C211 {
        @JsonAlias("e6411")
        private String measureUnitQualifier_6411;
        @JsonAlias("e6168")
        private String lengthDimension_6168;
        @JsonAlias("e6140")
        private String widthDimension_6140;
        @JsonAlias("e6008")
        private String heightDimension_6008;
    }

    @JsonAlias("c211")
    private Dimensions_C211 dimensions_C211;
}
