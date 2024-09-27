package customer.timetracker.clock_time.implementation;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/implementations")
public class ImplementationController {

    @Autowired
    private ImplementationService implementationService;

    // Endpoint to fetch general implementations
    @GetMapping
    public List<Implementation> getImplementations() {
        return implementationService.fetchImplementations();
    }

    // Endpoint to fetch implementations for a specific projectId
    @GetMapping(value = "/projects")
    public List<Implementation> getImplementationsAlm(@RequestParam String projectId) {
        return implementationService.fetchImplementationsAlm(projectId);
    }
}
