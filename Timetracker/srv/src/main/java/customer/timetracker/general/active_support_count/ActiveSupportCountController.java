package customer.timetracker.general.active_support_count;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("support/activeRecordCounts")
public class ActiveSupportCountController {
    @Autowired
    private ActiveSupportCountService activeAdminCountService;

    @GetMapping
    public List<ActiveSupportCount> getActiveRecordCounts() {
        return activeAdminCountService.getActiveRecordCounts();
    }
}
