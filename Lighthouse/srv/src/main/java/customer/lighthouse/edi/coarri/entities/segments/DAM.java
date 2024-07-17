package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class DAM {

    @JsonAlias("e7493")
    private String damageDetailsQualifier_7493;

    @Getter
    @Setter
    @Component
    public static class TypeOfDamage_C821 {
        @JsonAlias("e7501")
        private String typeOfDamageCoded_7501;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e7500")
        private String typeOfDamage_7500;
    }

    @JsonAlias("c821")
    private TypeOfDamage_C821 typeOfDamage_C821;

    @Getter
    @Setter
    @Component
    public static class DamageArea_C822 {
        @JsonAlias("e7503")
        private String damageAreaIdentification_7503;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e7502")
        private String damageArea_7502;
    }

    @JsonAlias("c822")
    private DamageArea_C822 damageArea_C822;

    @Getter
    @Setter
    @Component
    public static class DamageSeverity_C825 {
        @JsonAlias("e7509")
        private String damageSeverityCoded_7509;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e7508")
        private String damageSeverity_7508;
    }

    @JsonAlias("c825")
    private DamageSeverity_C825 damageSeverity_C825;

    @Getter
    @Setter
    @Component
    public static class Action_C826 {
        @JsonAlias("e1229")
        private String actionRequestNotificationCoded_1229;
        @JsonAlias("e1131")
        private String codeListQualifier_1131;
        @JsonAlias("e3055")
        private String codeListResponsibleAgencyCoded_3055;
        @JsonAlias("e1228")
        private String actionRequestNotification_1228;
    }

    @JsonAlias("c826")
    private Action_C826 action_C826;
}
