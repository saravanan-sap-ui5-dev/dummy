package customer.lighthouse.edi.coarri.entities.segments;

import java.util.List;

import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;

// Inner class for COM
@Getter
@Setter
@Component
public class COM {

    // Inner class for C076 Communication contact
    @Getter
    @Setter
    @Component
    public static class CommunicationContact_C076 {
        private String communicationAddressIdentifier_3148;
        private String communicationMeansTypeCode_3155;
    }

    private List<CommunicationContact_C076> communicationContact_C076;
}