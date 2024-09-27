package customer.timetracker.activity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/activity")
public class ActivityController {
    @Autowired
    ActivityService activityService;

    @RequestMapping(value = "")
    public ResponseEntity<?> getEnumerators() {
        try {
            return new ResponseEntity<>(activityService.getEnumerators(), HttpStatus.OK);
        } catch (Exception ex) {
            throw ex;
        }
    }

}
