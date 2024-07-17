package customer.lighthouse.edi.coarri.entities.segment_group;

import java.util.List;

import org.springframework.stereotype.Component;

import customer.lighthouse.edi.coarri.entities.segments.CTA;
import customer.lighthouse.edi.coarri.entities.segments.NAD;
import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class SegmentGroup2 {
    @JsonAlias("nad")
    private NAD nameAndAddress_NAD;
    @JsonAlias("cta")
    private List<CTA> contactInformation_CTA;

}
