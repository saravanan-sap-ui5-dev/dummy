package customer.timetracker.general.active_miscellaneous_count;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;





@Service
public class ActiveMiscellaneousCountService {
    @Autowired
    private ActiveMiscellaneousCountDAO activeAdminCountDAO;

    public List<ActiveMiscellaneousCount> getActiveRecordCounts() {
        return activeAdminCountDAO.getActiveRecordCounts();
    }
}