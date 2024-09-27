package customer.timetracker.customer;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.SqlResultSetMapping;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
@SqlResultSetMapping(
    name = "Customer_Mapping",
    classes = @ConstructorResult(
        targetClass = Customer.class,
        columns = {
            @ColumnResult(name = "id", type = Long.class),
            @ColumnResult(name = "name", type = String.class)
        }
    )
)
public class Customer {
    
    @Id
    private Long id;
    private String name;

    // Default constructor
    public Customer() {}

    // Parameterized constructor
    public Customer(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}
