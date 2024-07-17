package customer.lighthouse.edi.coarri.entities.segments;

import java.util.List;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class PIA {

    @JsonAlias("e4347")
    private String productFunctionQualifier_4347;

    @Getter
    @Setter
    @Component
    public static class ItemNumberIdentification_C212 {
        @JsonAlias("e7140")
        private String itemNumber_7140;
        @JsonAlias("e7143")
        private String itemNumberTypeCoded_7143;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
    }

    @JsonAlias("c212")
    private List<ItemNumberIdentification_C212> itemNumberIdentifications;
}
