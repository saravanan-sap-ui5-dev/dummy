package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class UNH {

	@JsonAlias("e0062")
	private String messageReferenceNumber_0062;

	// Inner class for S009 Message Identifier
	@Getter
	@Setter
	@Component
	public static class MessageIdentifier_S009 {
		@JsonAlias("e0065")
		private String messageType_0065;
		@JsonAlias("e0052")
		private String messageVersionNumber_0052;
		@JsonAlias("e0054")
		private String messageReleaseNumber_0054;
		@JsonAlias("e0051")
		private String controllingAgency_0051;
		@JsonAlias("e0057")
		private String associationAssignedCode_0057;
	}

	@JsonAlias("s009")
	private MessageIdentifier_S009 messageIdentifier_S009;

	@JsonAlias("e0068")
	private String commonAccessReference_0068;

	// Inner class for S010 Status of the Transfer
	@Getter
	@Setter
	@Component
	public static class StatusOfTransfer_S010 {
		@JsonAlias("e0070")
		private int sequenceOfTransfers_0070;
		@JsonAlias("e0073")
		private char firstAndLastTransfer_0073;
	}

	@JsonAlias("s010")
	private StatusOfTransfer_S010 statusOfTransfer_S010;
}
