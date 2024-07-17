package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class BGM {

    // Inner class for C002 Document/message name
    @Getter
    @Setter
    @Component
    public static class DocumentMessageName_C002 {
        @JsonAlias("e1001")
        private String documentMessageNameCoded_1001;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e1000")
        private String documentMessageName_1000;
    }

    @JsonAlias("c002")
    private DocumentMessageName_C002 documentMessageName_C002;
    @JsonAlias("e1004")
    private String documentMessageNumber_1004;
    @JsonAlias("e1225")
    private String messageFunctionCoded_1225;
    @JsonAlias("e4343")
    private String responseTypeCoded_4343;
}
