package customer.timetracker.clock_time.support;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import org.json.JSONException;
import org.json.JSONObject;
import org.apache.olingo.client.api.ODataClient;
import org.apache.olingo.client.api.domain.ClientCollectionValue;
import org.apache.olingo.client.api.domain.ClientComplexValue;
import org.apache.olingo.client.api.domain.ClientEntity;
import org.apache.olingo.client.api.domain.ClientObjectFactory;
import org.apache.olingo.client.api.domain.ClientPrimitiveValue;
import org.apache.olingo.client.api.domain.ClientProperty;
import org.apache.olingo.client.api.domain.ClientValue;
import org.apache.olingo.client.core.ODataClientFactory;
import org.apache.olingo.client.core.domain.ClientEntityImpl;
import org.apache.olingo.commons.api.edm.EdmPrimitiveTypeKind;
import org.apache.olingo.commons.api.edm.FullQualifiedName;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

// import customer.timetracker.clock_time.Support;
import customer.timetracker.utils.AppConstants;
import customer.timetracker.utils.ODataServiceUtils;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
public class SupportService {

        @Autowired
        private Support clockTime;

        ODataServiceUtils oDataServiceUtils = new ODataServiceUtils();

        // SupportDAO clockTimeDAO = new SupportDAO();

        public List<Support> getClockTime(SupportSearch clockTimeSearch)
                        throws Exception {

                String filter1 = "&$filter=";
                // String category = "and  CategoryTxt eq '* B1*'";
                String filter = "";
                String top = "&$top=100";
                boolean isFirstCondition = true;
                if (clockTimeSearch.getPostingDate() != "" && clockTimeSearch.getPostingDate() != null) {
                        filter1 += clockTimeSearch.getPostingDate() + "";
                        isFirstCondition = false;
                }
                if (clockTimeSearch.getTimeFrameId() != "") {
                        filter1 += " TimeFrameId eq '" + clockTimeSearch.getTimeFrameId() + "'";
                }

                if (clockTimeSearch.getObjectId() != "") {
                        filter1 += " and ObjectId eq '" + clockTimeSearch.getObjectId() + "'";
                        isFirstCondition = false;
                }
                if (clockTimeSearch.getCategoryTxt() != "") {
                        filter1 += " and CategoryTxt eq '" + clockTimeSearch.getCategoryTxt() + "'";
                        isFirstCondition = false;
                }
                if (clockTimeSearch.getPriority() != "") {
                        filter1 += " " + "and" + " " + "(" + clockTimeSearch.getPriority() + ")";
                        isFirstCondition = false;
                }

                if (clockTimeSearch.getDescriptiveStatusCode() != "") {
                        filter1 += " " + "and" + " " + "(" + clockTimeSearch.getDescriptiveStatusCode() + ")";
                        isFirstCondition = false;
                }
                if (clockTimeSearch.getSoldToParty() != "") {
                        filter1 += " " + "and" + " " + "(" + clockTimeSearch.getSoldToParty() + ")";
                        isFirstCondition = false;
                }

                String URL = AppConstants.base_url + AppConstants.support_sol + filter1  + top;
                String xmlData = oDataServiceUtils.hanaGETRequest(URL);

                try {
                        JSONObject jsonObject = new JSONObject(xmlData);

                        JSONObject res = (JSONObject) jsonObject.get("d");

                        JSONArray resArray = res.getJSONArray("results");

                        List<Support> partners = new ArrayList<Support>();
                        for (int i = 0; i < resArray.length(); i++) {
                                Support clockTime = new Support();
                                JSONObject obj = resArray.getJSONObject(i);

                                clockTime.setObjectId(
                                                obj.isNull("ObjectId") ? ""
                                                                : obj.getString("ObjectId"));

                                clockTime.setDescription(obj.isNull("Description") ? ""
                                                : obj.getString("Description"));
                                clockTime.setCreatedAtDateFormatted(obj.isNull("CreatedAtDateFormatted") ? ""
                                                : obj.getString("CreatedAtDateFormatted"));
                                clockTime.setPriorityTxt(obj.isNull("PriorityTxt") ? ""
                                                : obj.getString("PriorityTxt"));
                                clockTime.setUserStatusDescription(obj.isNull("UserStatusDescription") ? ""
                                                : obj.getString("UserStatusDescription"));
                                clockTime.setMPTPercentage(obj.isNull("MPTPercentage") ? ""
                                                : obj.getString("MPTPercentage"));
                                clockTime.setSoldToName(obj.isNull("SoldToName") ? ""
                                                : obj.getString("SoldToName"));
                                clockTime.setCategoryTxt(obj.isNull("CategoryTxt") ? ""
                                                : obj.getString("CategoryTxt"));
                                clockTime.setSoldToParty(obj.isNull("SoldToParty") ? ""
                                                : obj.getString("SoldToParty"));
                                clockTime.setPersonRespName(obj.isNull("PersonRespName") ? ""
                                                : obj.getString("PersonRespName"));

                                partners.add(clockTime);
                        }
                        return partners;
                } catch (JSONException err) {
                        throw err;
                }
        }
}
