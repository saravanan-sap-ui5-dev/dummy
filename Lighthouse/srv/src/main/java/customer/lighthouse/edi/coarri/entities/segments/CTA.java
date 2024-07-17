package customer.lighthouse.edi.coarri.entities.segments;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Component
public class CTA {

    @JsonAlias("e3139")
    private String contactFunctionCoded_3139;

    @Getter
    @Setter
    @Component
    public static class DepartmentOrEmployeeDetails_C056 {
        @JsonAlias("e3413")
        private String departmentOrEmployeeIdentification_3413;
        @JsonAlias("e3412")
        private String departmentOrEmployee_3412;
    }

    @JsonAlias("c056")
    private DepartmentOrEmployeeDetails_C056 departmentOrEmployeeDetails_C056;
}
