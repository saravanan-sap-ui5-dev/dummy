package customer.timetracker.time_sheet;
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
import customer.timetracker.utils.AppUtils;

@RestController
@RequestMapping(value = "/time-sheet")
public class TimeSheetController {
    @Autowired
    TimeSheetService timeSheetService;

    @PostMapping(value = "/filter")
    public ResponseEntity<?> getApplicationByFilter(
               @RequestBody TimeSheetEntity timeSheetEntity) {
        try {
            return new ResponseEntity<>(timeSheetService.getApplicationByFilter(timeSheetEntity), HttpStatus.OK);
        } catch (Exception ex) {
          return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping(value = "/{id}")
    public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
        try {
            return new ResponseEntity<>(timeSheetService.getApplicationById(id),HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), HttpStatus.BAD_REQUEST);
        }
    }
     @PostMapping(value = "")
    public ResponseEntity<?> addEditApplication(
            @RequestBody Collection<TimeSheet> timeSheet) throws Exception {
        try {
            return new ResponseEntity<>(
                timeSheetService.addEditApplication(timeSheet),
                    HttpStatus.OK);
        } catch (BusinessException ex) {
            return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), ex.getStatus());
        } catch (Exception ex) {
            return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), HttpStatus.BAD_REQUEST);
        }
    }
}
