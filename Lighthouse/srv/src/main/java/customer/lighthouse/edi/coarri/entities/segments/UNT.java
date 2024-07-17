package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class UNT {

    @JsonAlias("e0074")
    private int numberOfSegmentsInMessage_0074;
    @JsonAlias("e0062")
    private String messageReferenceNumber_0062;

}
