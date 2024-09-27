// package customer.timetracker.utils;

// import java.util.HashMap;
// import java.util.Map;

// import org.json.JSONObject;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpEntity;
// import org.springframework.http.HttpMethod;
// import org.springframework.http.ResponseEntity;
// import org.springframework.stereotype.Component;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpSession;

// @Service
// public class SessionUtils {

//     @Autowired
//     private HttpServletRequest sessionRequest;

//     public String fetchSAPCloudALM(HttpSession session) {
//         String almAccessToken = (String) session.getAttribute("almAccessToken");
//         if (almAccessToken == null || almAccessToken.isEmpty()) {
//             almAccessToken = fetchAndStoreAccessToken();
//         }
//         return almAccessToken;
//     }

//     private String fetchAndStoreAccessToken() {
//         Map<String, String> body = new HashMap<>();
//         body.put("clientid", AppConstants.sap_btp_client_id);
//         body.put("clientsecret", AppConstants.sap_btp_client_secret);
//         HttpEntity<String> request = new HttpEntity<>(AppUtils.createBearerTokenHeader(body));
//         ResponseEntity<String> response = new RestTemplate().exchange(AppConstants.projects,
//                 HttpMethod.POST, request, String.class);
//         String responseBody = response.getBody();
//         JSONObject jsonObject = new JSONObject(responseBody);
//         String accessToken = jsonObject.getString("access_token");
//         sessionRequest.getSession().setAttribute("almAccessToken", accessToken);
//         return accessToken;
//     }

//     public String fetchSAPCloudALM() {
//         HttpSession session = sessionRequest.getSession();
//         return fetchSAPCloudALM(session);
//     }
// }
