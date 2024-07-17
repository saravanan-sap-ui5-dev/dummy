package customer.lighthouse.edi.coarri.entities.segment_group;

import java.util.List;

import org.springframework.stereotype.Component;

import customer.lighthouse.edi.coarri.entities.segments.DGS;
import customer.lighthouse.edi.coarri.entities.segments.DIM;
import customer.lighthouse.edi.coarri.entities.segments.DTM;
import customer.lighthouse.edi.coarri.entities.segments.EQA;
import customer.lighthouse.edi.coarri.entities.segments.EQD;
import customer.lighthouse.edi.coarri.entities.segments.FTX;
import customer.lighthouse.edi.coarri.entities.segments.LOC;
import customer.lighthouse.edi.coarri.entities.segments.MEA;
import customer.lighthouse.edi.coarri.entities.segments.NAD;
import customer.lighthouse.edi.coarri.entities.segments.PIA;
import customer.lighthouse.edi.coarri.entities.segments.RFF;
import customer.lighthouse.edi.coarri.entities.segments.RNG;
import customer.lighthouse.edi.coarri.entities.segments.SEL;
import customer.lighthouse.edi.coarri.entities.segments.TMD;
import customer.lighthouse.edi.coarri.entities.segments.TMP;
import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class SegmentGroup3 {
    @JsonAlias("eqd")
    private EQD equipmentDetails_EQD;
    @JsonAlias("rff")
    private List<RFF> reference_RFF;
    @JsonAlias("tmd")
    private List<TMD> transportMovementDetails_TMD;
    @JsonAlias("dtm")
    private List<DTM> dateTimePeriod_DTM;
    @JsonAlias("loc")
    private List<LOC> placeLocationIdentification_LOC;
    @JsonAlias("mea")
    private List<MEA> measurements_MEA;
    @JsonAlias("dim")
    private List<DIM> dimensions_DIM;
    @JsonAlias("tmp")
    private List<TMP> temperature_TMP;
    @JsonAlias("rng")
    private List<RNG> rangeDetails_RNG;
    @JsonAlias("sel")
    private List<SEL> sealNumber_SEL;
    @JsonAlias("ftx")
    private List<FTX> freeText_FTX;
    @JsonAlias("dgs")
    private List<DGS> dangerousGoods_DGS;
    @JsonAlias("eqa")
    private List<EQA> attachedEquipment_EQA;
    @JsonAlias("pia")
    private List<PIA> additionalProductID_PIA;
    @JsonAlias("segGrp4")
    private List<SegmentGroup4> segmentGroup4;
    @JsonAlias("segGrp5")
    private SegmentGroup5 segmentGroup5;
    @JsonAlias("nad")
    private NAD nameAndAddress_NAD;

}
