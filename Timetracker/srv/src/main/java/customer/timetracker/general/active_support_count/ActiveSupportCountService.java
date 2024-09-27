package customer.timetracker.general.active_support_count;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;



@Service
public class ActiveSupportCountService {
    @Autowired
    private ActiveSupportCountDAO activeAdminCountDAO;

    public List<ActiveSupportCount> getActiveRecordCounts() {
        return activeAdminCountDAO.getActiveRecordCounts();
    }
}
