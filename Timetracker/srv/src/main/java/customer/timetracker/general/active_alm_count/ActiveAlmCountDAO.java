package customer.timetracker.general.active_alm_count;
import java.util.List;

import javax.persistence.EntityManager;

import javax.persistence.StoredProcedureQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import customer.timetracker.general.active_support_count.ActiveSupportCount;

@Repository
public class ActiveAlmCountDAO {
    @Autowired
    private EntityManager entityManager;

    public List<ActiveAlmCount> getActiveRecordCounts() {
        StoredProcedureQuery query = entityManager.createStoredProcedureQuery("GET_ACTIVE_SUPPORT");
        query.execute();
        @SuppressWarnings("unchecked")
        List<ActiveAlmCount> result = query.getResultList();
        return result;
    } 
}
