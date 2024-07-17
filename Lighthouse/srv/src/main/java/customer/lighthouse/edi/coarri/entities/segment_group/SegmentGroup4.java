package customer.lighthouse.edi.coarri.entities.segment_group;

import org.springframework.stereotype.Component;

import customer.lighthouse.edi.coarri.entities.segments.COD;
import customer.lighthouse.edi.coarri.entities.segments.DAM;
import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class SegmentGroup4 {
    @JsonAlias("dam")
    private DAM damage_DAM;
    @JsonAlias("cod")
    private COD componentDetails_COD;
}
