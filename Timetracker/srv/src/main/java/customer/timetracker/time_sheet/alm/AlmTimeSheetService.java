package customer.timetracker.time_sheet.alm;

import java.util.List;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import customer.timetracker.errors.BusinessException;
import customer.timetracker.time_sheet.TimeSheet;
import customer.timetracker.time_sheet.TimeSheetDetails;
import customer.timetracker.time_sheet.TimeSheetEntity;

@Component
@Primary
public class AlmTimeSheetService {
    @Autowired
    AlmTimeSheetDAO almTimeSheetDAO;

    public Collection<AlmTimeSheet> getApplications() {
        try {
            return almTimeSheetDAO.getApplications(true, 0L, null, 0,0);
        } catch (Exception exception) {
            throw exception;
        }
    }
        public  Collection <AlmTimeSheet> addEditApplication(
        Collection <AlmTimeSheet> almTimeSheet) throws Exception {
        try {
            return almTimeSheetDAO.addEditApplication(almTimeSheet);
        } catch (BusinessException exception) {
            throw exception;
        } catch (Exception exception) {
            throw exception;
        }
    }

    public Collection<AlmTimeSheet> getApplicationByFilter(AlmTimeSheetEntity almTimeSheetEntity) {
        try {
            return almTimeSheetDAO.getApplications(false, 0L, almTimeSheetEntity, 0, 0);
        } catch (Exception exception) {
            throw exception;
        }
    }
    // public TimeSheetDetails getApplicationById(Long id) {
    //     try {
    //         return almTimeSheetDAO.getApplicationById(id);
    //     } catch (BusinessException exception) {
    //         throw exception;
    //     } catch (Exception exception) {
    //         throw exception;
    //     }
    // }
}
