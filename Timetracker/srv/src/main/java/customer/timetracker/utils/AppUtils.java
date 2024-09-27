package customer.timetracker.utils;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import customer.timetracker.errors.ApiError;
import customer.timetracker.errors.BusinessException;

public final class AppUtils {

    public static String getBasicAuth(String user, String password) {
        final String auth = Base64
                .encodeBase64String(String.format("%s:%s", user, password).getBytes(StandardCharsets.UTF_8));
        return auth;
    }

    public static ApiError getErrorDetails(BusinessException ex) {
        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getErrorDescription(),
                ex.getErrorDescription(), ex.getErrorCode());

    }

    public static ApiError getErrorDetails(Exception ex) {
        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(),
                ex.getMessage(), null);

    }

    public static HttpHeaders createBasicAuthHeader(Map<String, String> credentials) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(credentials.get("clientid"), credentials.get("clientsecret"));
        return headers;
    }
   

    public static Map<String, String> getBasicAuthCredentials() {
        Map<String, String> credentials = new HashMap<>();
        credentials.put("clientid", "sb-TimeTrack!b5317|sapcloudalm!b3340");
        credentials.put("clientsecret", "b73a9ecf-adef-4644-a8cf-a59508053aaf$kSHQSSj3bp0arOLsaOz2MuFJWvNKZBD0mH7UNIQ2aVo=");
        return credentials;
    }


   
  
}
