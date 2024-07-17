package customer.lighthouse.edi.coarri.entities;

import java.util.List;

import org.springframework.stereotype.Component;

import customer.lighthouse.edi.coarri.entities.segment_group.SegmentGroup1;
import customer.lighthouse.edi.coarri.entities.segment_group.SegmentGroup2;
import customer.lighthouse.edi.coarri.entities.segment_group.SegmentGroup3;
import customer.lighthouse.edi.coarri.entities.segments.*;
import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class COARRI {
    // Header
    private UNH messageHeader_UNH;

    @JsonAlias("bgm")
    private BGM beginningOfMessage_BGM;

    @JsonAlias("ftx")
    private List<FTX> freeText_FTX;

    @JsonAlias("rff")
    private List<RFF> reference_RFF;

    @JsonAlias("segGrp1")
    private SegmentGroup1 segmentGroup1;

    @JsonAlias("segGrp2")
    private List<SegmentGroup2> segmentGroup2;

    @JsonAlias("segGrp3")
    private List<SegmentGroup3> segmentGroup3;

    @JsonAlias("cnt")
    private CNT controlTotal_CNT;

    private UNT messageTrailer_UNT;

}
