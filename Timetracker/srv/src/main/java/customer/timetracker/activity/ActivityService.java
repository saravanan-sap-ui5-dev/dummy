package customer.timetracker.activity;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class ActivityService {
    @Autowired
    ActivityDAO activityDAO;

    public Collection<Activity> getEnumerators() {
        try {
            return activityDAO.getEnumerators();
        } catch (Exception exception) {
            throw exception;
        }
    }
}