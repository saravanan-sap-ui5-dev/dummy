package customer.timetracker.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping(value = "/customer")
public class CustomerController {
     @Autowired
     CustomerService customerService;

    @RequestMapping(value = "")
    public ResponseEntity<?> getEnumerators() {
        try {
            return new ResponseEntity<>(customerService.getEnumerators(), HttpStatus.OK);
        } catch (Exception ex) {
            throw ex;
        }
    }
}
