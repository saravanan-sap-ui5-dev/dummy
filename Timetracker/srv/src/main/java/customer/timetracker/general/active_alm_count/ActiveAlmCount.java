package customer.timetracker.general.active_alm_count;
 
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ActiveAlmCount {
    
    @Id
    private Long id; // Assuming you have an identifier for the entity

    private String tableName;
    private Integer activeRecordCount;

    // Constructors, getters, and setters
    public ActiveAlmCount() {
    }

    public ActiveAlmCount(String tableName, Integer activeRecordCount) {
        this.tableName = tableName;
        this.activeRecordCount = activeRecordCount;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public Integer getActiveRecordCount() {
        return activeRecordCount;
    }

    public void setActiveRecordCount(Integer activeRecordCount) {
        this.activeRecordCount = activeRecordCount;
    }
}


