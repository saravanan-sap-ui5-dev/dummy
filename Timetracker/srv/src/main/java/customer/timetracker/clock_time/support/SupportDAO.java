package customer.timetracker.clock_time.support;
import java.util.List;
import java.util.Map;

import org.apache.olingo.client.api.domain.ClientEntity;
import org.springframework.stereotype.Component;

import customer.timetracker.utils.ODataServiceUtils;
public class SupportDAO {
    
    ODataServiceUtils oDataServiceUtils = new ODataServiceUtils();

    public Map<String, Object> getODataReqWithFilters(String serviceUrl, String entitySet, String expand,
            String selectedFields,
            String filter, String sort, Integer pagingEnabled, Integer top, Integer skip, Integer count)
            throws Exception {
        return oDataServiceUtils.getODataReqWithFilters(serviceUrl, entitySet, expand, selectedFields, filter, sort,
                pagingEnabled, top, skip, count);
    }
}
