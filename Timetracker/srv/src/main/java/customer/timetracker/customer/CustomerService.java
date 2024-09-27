package customer.timetracker.customer;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;



@Component
@Primary
public class CustomerService {
     @Autowired
     CustomerDAO customerDAO;

    public Collection<Customer> getEnumerators() {
        try {
            return customerDAO.getEnumerators();
        } catch (Exception exception) {
            throw exception;
        }
    }
}
