package customer.timetracker.time_sheet.alm;
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
@RequestMapping(value = "alm/time-sheet")
public class AlmTimeSheetController {
    @Autowired
    AlmTimeSheetService almTimeSheetService;

    @PostMapping(value = "/filter")
    public ResponseEntity<?> getApplicationByFilter(
               @RequestBody AlmTimeSheetEntity almTimeSheetEntity) {
        try {
            return new ResponseEntity<>(almTimeSheetService.getApplicationByFilter(almTimeSheetEntity), HttpStatus.OK);
        } catch (Exception ex) {
          return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), HttpStatus.BAD_REQUEST);
        }
    }
    // @GetMapping(value = "/{id}")
    // public ResponseEntity<?> getApplicationById(@PathVariable Long id) {
    //     try {
    //         return new ResponseEntity<>(almTimeSheetService.getApplicationById(id),HttpStatus.OK);
    //     } catch (Exception ex) {
    //         return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), HttpStatus.BAD_REQUEST);
    //     }
    // }
     @PostMapping(value = "")
    public ResponseEntity<?> addEditApplication(
            @RequestBody Collection<AlmTimeSheet> almTimeSheet) throws Exception {
        try {
            return new ResponseEntity<>(
                almTimeSheetService.addEditApplication(almTimeSheet),
                    HttpStatus.OK);
        } catch (BusinessException ex) {
            return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), ex.getStatus());
        } catch (Exception ex) {
            return new ResponseEntity<ApiError>(AppUtils.getErrorDetails(ex), HttpStatus.BAD_REQUEST);
        }
    }
}