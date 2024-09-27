package customer.timetracker.errors;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.annotation.JsonFormat;

@Component
public class BusinessException extends RuntimeException {
    public String errorCode;
    public String errorDescription;
    public HttpStatus status;
   

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy hh:mm:ss")
    public LocalDateTime timestamp;
   

   
    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorDescription() {
        return errorDescription;
    }

    public void setErrorDescription(String errorDescription) {
        this.errorDescription = errorDescription;
    }

    public HttpStatus getStatus() {
        return status;
    }
    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    private BusinessException() {
        timestamp = LocalDateTime.now();
    }
    public BusinessException(String errorCode, String errorDescription, HttpStatus status) {
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.status = status;
    }
}

