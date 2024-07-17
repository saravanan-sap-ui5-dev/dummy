package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

// Inner class for COD
@Getter
@Setter
@Component
public class COD {

    // Inner class for C823 Type of unit/component
    @Getter
    @Setter
    @Component
    public class TypeOfUnitComponent_C823 {

        @JsonAlias("e7505")
        private String typeOfUnitComponentCoded_7505;

        @JsonAlias("e1131")
        private String codeListQualifier_1131;

        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;

        @JsonAlias("e7504")
        private String typeOfUnitComponent_7504;
    }

    // Inner class for ComponentMaterial_C824
    @Getter
    @Setter
    @Component
    public class ComponentMaterial_C824 {

        @JsonAlias("e7507")
        private String componentMaterialCoded_7507;

        @JsonAlias("e1131")
        private String codeListQualifier_1131;

        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;

        @JsonAlias("e7506")
        private String componentMaterial_7506;
    }

    @JsonAlias("c823")
    private TypeOfUnitComponent_C823 typeOfUnitComponent_C823;
    @JsonAlias("c824")
    private ComponentMaterial_C824 componentMaterial_C824;
}