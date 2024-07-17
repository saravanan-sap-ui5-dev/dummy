package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class TMD {

    @Getter
    @Setter
    @Component
    public static class MovementType_C219 {
        @JsonAlias("e8335")
        private String movementTypeCoded_8335;
        @JsonAlias("e8334")
        private String movementType_8334;
    }

    @JsonAlias("c219")
    private MovementType_C219 movementType_C219;
    @JsonAlias("e8332")
    private String equipmentPlan_8332;
    @JsonAlias("e8341")
    private String haulageArrangementsCoded_8341;
}
