package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class TMP {

    @JsonAlias("e6245")
    private String temperatureQualifier_6245;

    @Getter
    @Setter
    @Component
    public static class TemperatureSetting_C239 {
        @JsonAlias("e6246")
        private String temperatureSetting_6246;
        @JsonAlias("e6411")
        private String measureUnitQualifier_6411;
    }

    @JsonAlias("c239")
    private TemperatureSetting_C239 temperatureSetting_C239;
}
