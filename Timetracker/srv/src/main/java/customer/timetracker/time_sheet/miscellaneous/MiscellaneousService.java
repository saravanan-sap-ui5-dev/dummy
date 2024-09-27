package customer.timetracker.time_sheet.miscellaneous;
import java.util.List;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import customer.timetracker.errors.BusinessException;
import customer.timetracker.time_sheet.TimeSheet;
import customer.timetracker.time_sheet.TimeSheetDAO;
import customer.timetracker.time_sheet.TimeSheetDetails;
import customer.timetracker.time_sheet.TimeSheetEntity;

@Component
@Primary
public class MiscellaneousService {
     @Autowired
     MiscellaneousDAO miscellaneousDAO;

    public Collection<Miscellaneous> getApplications() {
        try {
            return miscellaneousDAO.getApplications(true, 0L, null, 0,0);
        } catch (Exception exception) {
            throw exception;
        }
    }
        public  Collection <Miscellaneous> addEditApplication(
        Collection <Miscellaneous> miscellaneous) throws Exception {
        try {
            return miscellaneousDAO.addEditApplication(miscellaneous);
        } catch (BusinessException exception) {
            throw exception;
        } catch (Exception exception) {
            throw exception;
        }
    }

    public Collection<Miscellaneous> getApplicationByFilter(MiscellaneousEntity miscellaneousEntity) {
        try {
            return miscellaneousDAO.getApplications(false, 0L, miscellaneousEntity, 0, 0);
        } catch (Exception exception) {
            throw exception;
        }
    }
    // public TimeSheetDetails getApplicationById(Long id) {
    //     try {
    //         return miscellaneousDAO.getApplicationById(id);
    //     } catch (BusinessException exception) {
    //         throw exception;
    //     } catch (Exception exception) {
    //         throw exception;
    //     }
    // }
}

