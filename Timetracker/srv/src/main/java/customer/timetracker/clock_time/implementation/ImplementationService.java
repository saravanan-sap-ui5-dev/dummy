package customer.timetracker.clock_time.implementation;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ImplementationService {

    @Value("${sap.btp.client_id}")
    private String clientId;

    @Value("${sap.btp.client_secret}")
    private String clientSecret;

    private final String tokenUrl = "https://inflexion-cloudalm.authentication.jp10.hana.ondemand.com/oauth/token?grant_type=client_credentials";
    private final String implementationUrl = "https://inflexion-cloudalm.jp10.alm.cloud.sap/api/calm-";
    private final String almProjects = "projects/v1/projects";
    private final String tasksEndpoint = "tasks/v1/tasks?projectId=";
    private final String assigneeParam = "&assigneeId=dhanush@inflexiontechfze.com";

    public List<Implementation> fetchImplementations() {
        String accessToken = fetchAccessToken();

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Implementation[]> response = restTemplate.exchange(
            implementationUrl + almProjects,
            HttpMethod.GET,
            entity,
            Implementation[].class
        );

        return List.of(response.getBody());
    }

    public List<Implementation> fetchImplementationsAlm(String projectId) {
        String accessToken = fetchAccessToken();

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);

        String url = implementationUrl + tasksEndpoint + projectId + assigneeParam;
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<Implementation[]> response = restTemplate.exchange(
            url,
            HttpMethod.GET,
            entity,
            Implementation[].class
        );

        return List.of(response.getBody());
    }

    private String fetchAccessToken() {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(clientId, clientSecret);
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request = new HttpEntity<>("grant_type=client_credentials", headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        return (String) response.getBody().get("access_token");
    }
}
