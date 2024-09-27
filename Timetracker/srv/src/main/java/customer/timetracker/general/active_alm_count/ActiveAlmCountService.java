package customer.timetracker.general.active_alm_count;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import customer.timetracker.general.active_support_count.ActiveSupportCount;



@Service
public class ActiveAlmCountService {
    @Autowired
    private ActiveAlmCountDAO activeAdminCountDAO;

    public List<ActiveAlmCount> getActiveRecordCounts() {
        return activeAdminCountDAO.getActiveRecordCounts();
    }
}
