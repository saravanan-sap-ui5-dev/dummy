package customer.timetracker.clock_time.support;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/clock-time/support")
public class SupportController {

    @Autowired
    SupportService supportService;

    @PostMapping(value = "/filter")
    public ResponseEntity<List<Support>> getClockTime(@RequestBody SupportSearch supportSearch) {
        try {
            List<Support> res = supportService.getClockTime(supportSearch);
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
