package customer.timetracker.utils;

import java.io.InputStream;
import java.net.URI;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import org.springframework.http.MediaType;
import org.apache.olingo.client.api.ODataClient;
import org.apache.olingo.client.api.communication.ODataClientErrorException;
import org.apache.olingo.client.api.communication.request.cud.ODataEntityCreateRequest;
import org.apache.olingo.client.api.communication.request.cud.ODataEntityUpdateRequest;
import org.apache.olingo.client.api.communication.request.cud.UpdateType;
import org.apache.olingo.client.api.communication.request.retrieve.ODataRawRequest;
import org.apache.olingo.client.api.communication.request.retrieve.ODataValueRequest;
import org.apache.olingo.client.api.communication.response.ODataEntityCreateResponse;
import org.apache.olingo.client.api.communication.response.ODataEntityUpdateResponse;
import org.apache.olingo.client.api.communication.response.ODataResponse;
import org.apache.olingo.client.api.domain.ClientEntity;
import org.apache.olingo.client.api.uri.QueryOption;
import org.apache.olingo.client.api.uri.URIBuilder;
import org.apache.olingo.client.core.ODataClientFactory;
import org.apache.olingo.client.core.http.BasicAuthHttpClientFactory;
import org.apache.olingo.commons.api.format.ContentType;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class ODataServiceUtils {
    public static ODataResponse getOData(String url, String endPointMethod) throws Exception {
        if (!url.isEmpty()) {
            try {

                ODataClient client = ODataClientFactory.getClient();
                URI connURI = client.newURIBuilder(url).appendEntitySetSegment(endPointMethod).build();
                ODataRawRequest req = client.getRetrieveRequestFactory().getRawRequest(connURI);
                req.addCustomHeader("Authorization",
                        "Basic " + AppUtils.getBasicAuth(AppConstants.user, AppConstants.password));
                req.addCustomHeader("Accept", "*/*");
                req.setFormat("application/json");
                ODataResponse res = req.execute();
                return res;
            } catch (Exception ex) {
                return null;
                // throw new Exception(fetchError);
            }
        }
        return null;
    }

    public Long getCount(String serviceUrl, String entitySet) {
        ODataClient client = ODataClientFactory.getClient();
        try {

            client.getConfiguration()
                    .setHttpClientFactory(new BasicAuthHttpClientFactory(AppConstants.user, AppConstants.password));

            URI entitySetURI = client.newURIBuilder(serviceUrl).appendEntitySetSegment(entitySet).count().build();
            // Create the request
            ODataValueRequest request = client.getRetrieveRequestFactory().getValueRequest(entitySetURI);
            request.addCustomHeader("Accept", "*/*");
            request.setFormat(ContentType.TEXT_PLAIN);
            return Long.valueOf(request.execute().getBody().asPrimitive().toString());
        } catch (ODataClientErrorException ex) {
            System.out.println("Error: " + ex.getMessage());
            throw ex;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public Map<String, Object> getODataReq(String serviceUrl, String entitySet) throws Exception {
        ODataClient client = ODataClientFactory.getClient();
        if (!serviceUrl.isEmpty()) {
            try {

                client.getConfiguration()
                        .setHttpClientFactory(new BasicAuthHttpClientFactory(AppConstants.user, AppConstants.password));

                URI entitySetURI = client.newURIBuilder(serviceUrl).appendEntitySetSegment(entitySet)
                        .addQueryOption(QueryOption.FORMAT, "json")
                        .build();
                // Create the request
                ODataRawRequest request = client.getRetrieveRequestFactory().getRawRequest(entitySetURI);
                request.addCustomHeader("Accept", "*/*");
                // Execute the request
                ODataResponse response = request.execute();
                InputStream inStream = response.getRawResponse();
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> jsonMap = mapper.readValue(inStream, Map.class);

                return jsonMap;
            } catch (ODataClientErrorException ex) {
                System.out.println("Error: " + ex.getMessage());
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }

        }
        return null;
    }


    public Map<String, Object> getODataReqByURL(String serviceUrl) throws Exception {
        ODataClient client = ODataClientFactory.getClient();
        if (!serviceUrl.isEmpty()) {
            try {
                client.getConfiguration()
                        .setHttpClientFactory(new BasicAuthHttpClientFactory(AppConstants.user, AppConstants.password));

                URI entitySetURI = client.newURIBuilder(serviceUrl)
                        .addQueryOption(QueryOption.FORMAT, "json")
                        .build();
                // Create the request
                ODataRawRequest request = client.getRetrieveRequestFactory().getRawRequest(entitySetURI);
                request.addCustomHeader("Accept", "*/*");
                // Execute the request
                ODataResponse response = request.execute();
                InputStream inStream = response.getRawResponse();
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> jsonMap = mapper.readValue(inStream, Map.class);

                return jsonMap;
            } catch (ODataClientErrorException ex) {

                System.out.println("Error: " + ex.getMessage());
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }

        }
        return null;
    }

    public Map<String, Object> getODataReqByURL(String serviceUrl, String expand) throws Exception {
        ODataClient client = ODataClientFactory.getClient();
        if (!serviceUrl.isEmpty()) {
            try {

                client.getConfiguration()
                        .setHttpClientFactory(new BasicAuthHttpClientFactory(AppConstants.user, AppConstants.password));

                URIBuilder entitySetURI = entitySetURI = client.newURIBuilder(serviceUrl)
                        .addQueryOption(QueryOption.FORMAT, "json");
                // .addQueryOption(QueryOption.EXPAND, expand)
                // .build();
                if (!expand.isEmpty()) {
                    entitySetURI.addQueryOption(QueryOption.EXPAND, expand);
                }
                URI uri = entitySetURI.build();
                // Create the request
                ODataRawRequest request = client.getRetrieveRequestFactory().getRawRequest(uri);
                request.addCustomHeader("Accept", "*/*");
                // Execute the request
                ODataResponse response = request.execute();
                InputStream inStream = response.getRawResponse();
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> jsonMap = mapper.readValue(inStream, Map.class);

                return jsonMap;
            } catch (ODataClientErrorException ex) {
                System.out.println("Error: " + ex.getMessage());
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }

        }
        return null;
    }

  

    public Map<String, Object> getODataReqWithFilters(String serviceUrl, String entitySet, String expand,
            String selectedFields,
            String filter, String sort, Integer pagingEnabled, Integer top, Integer skip, Integer count)
            throws Exception {
        ODataClient client = ODataClientFactory.getClient();
        if (!serviceUrl.isEmpty()) {
            try {

                client.getConfiguration()
                        .setHttpClientFactory(new BasicAuthHttpClientFactory(AppConstants.user, AppConstants.password));

                URIBuilder entitySetURI = client.newURIBuilder(serviceUrl).appendEntitySetSegment(entitySet)
                        .addQueryOption(QueryOption.FORMAT, "json");
                // boolean isRecord = result(BusinessPartner);
                if (!selectedFields.isEmpty()) {
                    entitySetURI.addQueryOption(QueryOption.SELECT, selectedFields);
                }
                if (!filter.isEmpty()) {
                    entitySetURI.addQueryOption(QueryOption.FILTER, filter);
                }
                if (!expand.isEmpty()) {
                    entitySetURI.addQueryOption(QueryOption.EXPAND, expand);
                }
                if (pagingEnabled != null && pagingEnabled == 1) {
                    if (count == 1 && count != null) {
                        entitySetURI.addQueryOption("inlinecount", "allpages", true);
                    } else if (count == 2 && count != null) {
                        entitySetURI.addQueryOption("count", "true", true);
                    }
                    entitySetURI.addQueryOption(QueryOption.TOP, top.toString());
                    entitySetURI.addQueryOption(QueryOption.SKIP, skip.toString());
                    // if (sort != null) {
                    //     // Override the ORDERBY query option
                    //     entitySetURI.replaceQueryOption(QueryOption.ORDERBY, sort);
                    // } else {
                    //     entitySetURI.addQueryOption(QueryOption.ORDERBY, "CreationDate desc, CreationTime desc");
                    // }
                }
                URI uri = entitySetURI.build();
                // Create the request
                ODataRawRequest request = client.getRetrieveRequestFactory().getRawRequest(uri);
                request.addCustomHeader("Accept", "*/*");
                // Execute the request
                ODataResponse response = request.execute();
                InputStream inStream = response.getRawResponse();
                ObjectMapper mapper = new ObjectMapper();
                Map<String, Object> res = mapper.readValue(inStream, Map.class);

                return res;
            } catch (ODataClientErrorException ex) {
                System.out.println("Error: " + ex.getMessage());
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }

        }
        return null;
    }

    public Map<String, Object> addODataReqByURL(String serviceUrl, ClientEntity ce, List<String> token)
            throws Exception {
        ODataClient client = ODataClientFactory.getClient();
        if (!serviceUrl.isEmpty()) {
            try {

                client.getConfiguration()
                        .setHttpClientFactory(new BasicAuthHttpClientFactory(AppConstants.user, AppConstants.password));

                URIBuilder entitySetURI = client.newURIBuilder(serviceUrl);

                URI uri = entitySetURI.build();

                ce.setMediaContentType("application/json");

                ODataEntityCreateRequest<ClientEntity> request = client.getCUDRequestFactory()
                        .getEntityCreateRequest(uri, ce);

                request.addCustomHeader("Content-Type", "application/json");
                request.addCustomHeader("Accept", "application/json");
                request.addCustomHeader("X-CSRF-Token", token.get(0));
                request.addCustomHeader("Cookie", String.join("; ", token.get(1)));
                ODataEntityCreateResponse<ClientEntity> response = request.execute();
                String location = response.getHeader("location").iterator().next();
                Map<String, Object> res = getODataReqByURL(location);
                // String statusMessage = response.getStatusMessage();
                // InputStream inStream = response.getRawResponse();
                // ObjectMapper mapper = new ObjectMapper();
                // Map<String, Object> res = mapper.readValue(inStream, Map.class);

                return res;
            } catch (ODataClientErrorException ex) {
                System.out.println("Error: " + ex.getMessage());
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }
        }
        return null;
    }

    public List<String> generateToken(String serviceUrl) throws Exception {
        ODataClient client = ODataClientFactory.getClient();
        if (!serviceUrl.isEmpty()) {
            try {

                client.getConfiguration()
                        .setHttpClientFactory(new BasicAuthHttpClientFactory(AppConstants.user, AppConstants.password));

                URIBuilder entitySetURI = entitySetURI = client.newURIBuilder(serviceUrl);
                // .addQueryOption(QueryOption.FORMAT, "json");

                URI uri = entitySetURI.build();
                // Create the request
                ODataRawRequest request = client.getRetrieveRequestFactory().getRawRequest(uri);
                request.addCustomHeader("Accept", "*/*");
                request.addCustomHeader("X-CSRF-Token", "fetch");
                // Execute the request
                ODataResponse response = request.execute();

                String cookie = response.getHeader("Set-Cookie").iterator().next();
                String csrfToken = response.getHeader("x-csrf-token").iterator().next();

                List<String> tokenDetails = new ArrayList<>();

                tokenDetails.add(csrfToken);
                tokenDetails.add(cookie);

                return tokenDetails;

            } catch (ODataClientErrorException ex) {
                System.out.println("Error: " + ex.getMessage());
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }

        }
        return null;
    }

    public Map<String, Object> updateODataReqByURL(String serviceUrl, String entityId, ClientEntity updatedEntity,
            List<String> token)
            throws Exception {
        ODataClient client = ODataClientFactory.getClient();
        if (!serviceUrl.isEmpty()) {
            try {

                client.getConfiguration()
                        .setHttpClientFactory(new BasicAuthHttpClientFactory(AppConstants.user, AppConstants.password));
                // URIBuilder entitySetURI =
                // client.newURIBuilder(serviceUrl).appendEntitySetSegment(entityId);;
                URIBuilder entitySetURI = client.newURIBuilder(serviceUrl);

                URI uri = entitySetURI.build();
                updatedEntity.setMediaContentType("application/json");
                ODataEntityUpdateRequest<ClientEntity> request = client.getCUDRequestFactory()
                        .getEntityUpdateRequest(uri, UpdateType.PATCH, updatedEntity);
                request.addCustomHeader("Content-Type", "application/json");
                request.addCustomHeader("Accept", "application/json");
                request.addCustomHeader("X-CSRF-Token", token.get(0));
                request.addCustomHeader("Cookie", String.join("; ", token.get(1)));
                ODataEntityUpdateResponse<ClientEntity> response = request.execute();
                String statusMessage = response.getStatusMessage();
                Map<String, Object> res = getODataReqByURL(serviceUrl);
                return res;
            } catch (ODataClientErrorException ex) {
                System.out.println("Error: " + ex.getMessage());
                throw ex;
            } catch (Exception e) {
                e.printStackTrace();
                throw e;
            }
        }
        return null;
    }
    public ResponseEntity<String> batchRequest(String urlBatch, String body, List<String> token) {
        try {
            // String urlBatch =
            // "https://my404782-api.s4hana.cloud.sap:443/sap/opu/odata/sap/API_BUSINESS_PARTNER/$batch";
            HttpEntity updateHeaderRes = new HttpEntity(body, updateODataHeadersPatch(token));
            ResponseEntity<String> response = new RestTemplate().exchange(urlBatch, HttpMethod.POST, updateHeaderRes,
                    String.class);
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
   

    public static HttpHeaders updateODataHeadersPatch(List<String> token) {
        return new HttpHeaders() {
            {
                set("X-CSRF-Token", token.get(0));
                set("Content-Type", "multipart/mixed;boundary=batch_01");
                set("Cookie", token.get(1));
                setBasicAuth(AppConstants.user, AppConstants.password);
            }
        };
    }

    public String hanaGETRequest(String url) {
        try {
            HttpEntity updateHeaderRes = new HttpEntity(headersForGetRequest());
            ResponseEntity<String> response = new RestTemplate().exchange(url, HttpMethod.GET, updateHeaderRes,
                    String.class);

                    return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public String hanaPOSTRequest(String urlBatch, String body, List<String> token) {
        try {
            HttpEntity updateHeaderRes = new HttpEntity(body, headersForPostRequest(token));
            ResponseEntity<String> response = new RestTemplate().exchange(urlBatch, HttpMethod.POST, updateHeaderRes,
                    String.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
    

    public String hanaDELETERequest(String url, List<String> token) {
        try {
            HttpEntity requestEntity = new HttpEntity(headersForDeleteRequest(token));
            ResponseEntity<String> response = new RestTemplate().exchange(url, HttpMethod.DELETE, requestEntity,
                    String.class);
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public static HttpHeaders headersForGetRequest() {
        return new HttpHeaders() {
            {
                set("Content-Type", "application/json");
                setBasicAuth(AppConstants.user, AppConstants.password);
            }
        };
    }

    public static HttpHeaders headersForPostRequest(List<String> token) {
        return new HttpHeaders() {
            {
                set("X-CSRF-Token", token.get(0));
                set("Content-Type", "application/json");
                set("Cookie", token.get(1));
                setBasicAuth(AppConstants.user, AppConstants.password);
            }
        };
    }

    public static HttpHeaders headersForDeleteRequest(List<String> token) {
        return new HttpHeaders() {
            {
                set("X-CSRF-Token", token.get(0));
                set("Cookie", token.get(1));
                setBasicAuth(AppConstants.user, AppConstants.password);
            }
        };
    }
}
