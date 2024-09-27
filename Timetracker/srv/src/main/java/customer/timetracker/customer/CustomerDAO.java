package customer.timetracker.customer;

import java.util.Collection;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.StoredProcedureQuery;

import org.springframework.stereotype.Component;

@Component
public class CustomerDAO {
    @PersistenceContext
    private EntityManager entityManager;
    
    public Collection<Customer> getEnumerators() {
        try {

            StoredProcedureQuery spGetStatus = entityManager
                    .createStoredProcedureQuery("GET_CUSTOMER", "Customer_Mapping");
            spGetStatus.execute();
            @SuppressWarnings("unchecked")
            List<Customer> results = spGetStatus.getResultList();
            return results;
        } catch (Exception exception) {
            throw exception;
        }
    }
}
