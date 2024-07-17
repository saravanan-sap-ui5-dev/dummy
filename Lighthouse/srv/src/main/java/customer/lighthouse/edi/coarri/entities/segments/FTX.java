package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class FTX {

    @JsonAlias("e4451")
    private String textSubjectQualifier_4451;

    @JsonAlias("e4453")
    private String textFunctionCoded_4453;

    @Getter
    @Setter
    @Component
    public static class TextReference_C107 {
        @JsonAlias("e4441")
        private String freeTextCoded_4441;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgency_3055;
    }

    @JsonAlias("c107")
    private TextReference_C107 textReference_C107;

    @Getter
    @Setter
    @Component
    public static class TextLiteral_C108 {
        @JsonAlias("e4440")
        private String freeText1_4440;
        @JsonAlias("e4440")
        private String freeText2_4440;
        @JsonAlias("e4440")
        private String freeText3_4440;
        @JsonAlias("e4440")
        private String freeText4_4440;
        @JsonAlias("e4440")
        private String freeText5_4440;
    }

    @JsonAlias("c108")
    private TextLiteral_C108 textLiteral_C108;

    @JsonAlias("e3453")
    private String languageCoded_3453;
}
