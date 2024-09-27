package customer.timetracker.activity;

import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;

import org.springframework.stereotype.Component;

@Component
public class ActivityDAO {
    @PersistenceContext
    private EntityManager entityManager;

    public Collection<Activity> getEnumerators() {
        try {

            StoredProcedureQuery spGetStatus = entityManager
                    .createStoredProcedureQuery("GET_ACTIVITY", "Activity_Mapping");
            spGetStatus.execute();
            @SuppressWarnings("unchecked")
            List<Activity> results = spGetStatus.getResultList();
            return results;
        } catch (Exception exception) {
            throw exception;
        }
    }

}
