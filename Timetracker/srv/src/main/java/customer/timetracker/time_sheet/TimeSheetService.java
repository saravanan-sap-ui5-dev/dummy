package customer.timetracker.time_sheet;

import java.util.List;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import customer.timetracker.errors.BusinessException;

@Component
@Primary
public class TimeSheetService {
    @Autowired
    TimeSheetDAO timeSheetDAO;

    public Collection<TimeSheet> getApplications() {
        try {
            return timeSheetDAO.getApplications(true, 0L, null, 0,0);
        } catch (Exception exception) {
            throw exception;
        }
    }
        public  Collection <TimeSheet> addEditApplication(
        Collection <TimeSheet> timeSheet) throws Exception {
        try {
            return timeSheetDAO.addEditApplication(timeSheet);
        } catch (BusinessException exception) {
            throw exception;
        } catch (Exception exception) {
            throw exception;
        }
    }

    public Collection<TimeSheet> getApplicationByFilter(TimeSheetEntity timeSheetEntity) {
        try {
            return timeSheetDAO.getApplications(false, 0L, timeSheetEntity, 0, 0);
        } catch (Exception exception) {
            throw exception;
        }
    }
    public TimeSheetDetails getApplicationById(Long id) {
        try {
            return timeSheetDAO.getApplicationById(id);
        } catch (BusinessException exception) {
            throw exception;
        } catch (Exception exception) {
            throw exception;
        }
    }
}
