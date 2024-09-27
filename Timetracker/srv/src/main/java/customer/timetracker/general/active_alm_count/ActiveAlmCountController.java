package customer.timetracker.general.active_alm_count;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("alm/activeRecordCounts")
public class ActiveAlmCountController {
    @Autowired
    private ActiveAlmCountService activeAdminCountService;

    @GetMapping
    public List<ActiveAlmCount> getActiveRecordCounts() {
        return activeAdminCountService.getActiveRecordCounts();
    }
}
