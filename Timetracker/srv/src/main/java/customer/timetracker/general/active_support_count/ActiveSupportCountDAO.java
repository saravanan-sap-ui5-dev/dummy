package customer.timetracker.general.active_support_count;
import java.util.List;

import javax.persistence.EntityManager;

import javax.persistence.StoredProcedureQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ActiveSupportCountDAO {
    @Autowired
    private EntityManager entityManager;

    public List<ActiveSupportCount> getActiveRecordCounts() {
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("GET_ACTIVE_SUPPORT");
        query.execute();
        @SuppressWarnings("unchecked")
        List<ActiveSupportCount> result = query.getResultList();
        return result;
    } 
}
