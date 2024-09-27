package customer.timetracker.time_sheet.miscellaneous;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import customer.timetracker.errors.ApiError;
import customer.timetracker.errors.BusinessException;
import customer.timetracker.time_sheet.TimeSheet;
import customer.timetracker.time_sheet.TimeSheetEntity;
import customer.timetracker.utils.AppUtils;

@RestController
@RequestMapping(value = "/miscellaneous")
public class MiscellaneousController {
    @Autowired
    MiscellaneousService miscellaneousService;

    @PostMapping(value = "/filter")
    public ResponseEntity<?> getApplicationByFilter(
               @RequestBody MiscellaneousEntity miscellaneousEntity) {
        try {
            return new ResponseEntity<>(miscellaneousService.getApplicationByFilter(miscellaneousEntity), HttpStatus.OK);
        } catch (Exception ex) {
          return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), HttpStatus.BAD_REQUEST);
        }
    }
    // @GetMapping(value = "/{id}")
    // public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
    //     try {
    //         return new ResponseEntity<>(miscellaneousService.getApplicationById(id),HttpStatus.OK);
    //     } catch (Exception ex) {
    //         return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), HttpStatus.BAD_REQUEST);
    //     }
    // }
     @PostMapping(value = "")
    public ResponseEntity<?> addEditApplication(
            @RequestBody Collection<Miscellaneous> miscellaneous) throws Exception {
        try {
            return new ResponseEntity<>(
                miscellaneousService.addEditApplication(miscellaneous),
                    HttpStatus.OK);
        } catch (BusinessException ex) {
            return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), ex.getStatus());
        } catch (Exception ex) {
            return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), HttpStatus.BAD_REQUEST);
        }
    }
}
