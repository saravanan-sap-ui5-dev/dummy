package customer.lighthouse.edi;

import jakarta.xml.bind.JAXBContext;
import jakarta.xml.bind.JAXBElement;
import jakarta.xml.bind.JAXBException;

import org.mvel2.sh.Main;
import org.smooks.Smooks;
import org.smooks.api.SmooksException;
//import org.smooks.edifact.binding.d03b.Interchange;
import org.smooks.edifact.binding.d95b.Interchange;
import org.smooks.edifact.binding.d95b.Message;
import org.smooks.engine.DefaultApplicationContextBuilder;
import org.smooks.io.payload.StringSource;
import org.smooks.support.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.xml.sax.SAXException;

import customer.lighthouse.edi.coarri.entities.COARRI;
import customer.lighthouse.edi.coarri.entities.segments.UNH;
import customer.lighthouse.edi.coarri.entities.segments.UNT;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.IOException;
import java.io.StringWriter;
import java.util.List;

import customer.lighthouse.Application;

@RequestMapping("/Test")
@RestController
public class EDIController {

	final static ObjectMapper mapper = new ObjectMapper();

	protected static Interchange runSmooksTransform() throws IOException, SAXException, SmooksException, JAXBException {
		// Configure Smooks using a Smooks config...
		Smooks smooks = new Smooks(
				new DefaultApplicationContextBuilder().withClassLoader(Main.class.getClassLoader()).build());
		smooks.addResourceConfigs("smooks-config.xml");

		try {
			final StringWriter writer = new StringWriter();
			smooks.filterSource(new StreamSource(Main.class.getResourceAsStream("/PAXLST.edi")),
					new StreamResult(writer));

			JAXBContext jaxbContext = JAXBContext.newInstance(Interchange.class,
					org.smooks.edifact.binding.service.ObjectFactory.class,
					org.smooks.edifact.binding.d95b.ObjectFactory.class);
			return (Interchange) jaxbContext.createUnmarshaller().unmarshal(new StringSource(writer.toString()));
		} finally {
			smooks.close();
		}
	}

	private static String readInputMessage() throws IOException {
		return StreamUtils.readStreamAsString(Application.class.getResourceAsStream("/PAXLST.edi"), "UTF-8");
	}

	@GetMapping("")
	public String convert() throws SmooksException, IOException, SAXException, JAXBException {
		System.out.println("\n\n==============Message In==============");
		System.out.println(readInputMessage());
		System.out.println("======================================\n");

		Interchange messageOut = EDIController.runSmooksTransform();

		// Setup Jackson ObjectMapper
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.enable(SerializationFeature.INDENT_OUTPUT);

		COARRI coarri = new COARRI();
		UNH unhObj = null;
		UNT untObj = null;

		if (messageOut != null && !messageOut.getMessage().isEmpty()) {
			Message message = messageOut.getMessage().get(0);

			if (message != null && !message.getContent().isEmpty()) {
				List<Object> content = message.getContent();
				for (Object obj : content) {
					if (obj instanceof JAXBElement) {
						JAXBElement<?> element = (JAXBElement<?>) obj;
						String name = element.getName().toString();
						Object value = element.getValue();

						try {
							// Use local variables for temporary storage
							UNH tempUnhObj = unhObj;
							UNT tempUntObj = untObj;

							if (name.contains("UNH")) {
								String unhJson = mapper.writeValueAsString(value);
								tempUnhObj = mapper.readValue(unhJson, UNH.class);
								unhObj = tempUnhObj;
							} else if (name.contains("UNT")) {
								String untJson = mapper.writeValueAsString(value);
								tempUntObj = mapper.readValue(untJson, UNT.class);
								untObj = tempUntObj;
							} else if (name.contains("COARRI")) {
								String coarriJson = mapper.writeValueAsString(value);
								coarri = mapper.readValue(coarriJson, COARRI.class);
							}

						} catch (JsonProcessingException e) {
							e.printStackTrace();
						}
					}
				}
			}
		}
		coarri.setMessageHeader_UNH(unhObj);
		coarri.setMessageTrailer_UNT(untObj);

		System.out.println("==============Message Out=============" + mapper.writeValueAsString(coarri));
		return mapper.writeValueAsString(coarri);
	}

}
