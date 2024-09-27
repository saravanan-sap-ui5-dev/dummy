package customer.timetracker.general.active_miscellaneous_count;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;





@RestController
@RequestMapping("miscellaneous/activeRecordCounts")
public class ActiveMiscellaneousCountController {
    @Autowired
    private ActiveMiscellaneousCountService activeAdminCountService;

    @GetMapping
    public List<ActiveMiscellaneousCount> getActiveRecordCounts() {
        return activeAdminCountService.getActiveRecordCounts();
    }
}

