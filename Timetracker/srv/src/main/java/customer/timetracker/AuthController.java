package customer.timetracker;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {
    @GetMapping("/userInfo")
    public Map<String, String> userInfo() {
        Map<String, String> result = new HashMap<>();
        result.put("email", "dhanush@inflexiontechfze.com");
        // return result;
        return result;
    }
    // public Map<String, String> sayHello(@AuthenticationPrincipal Token token) {
    // Map<String, String> result = new HashMap<>();
    // result.put("grant type", token.getGrantType());
    // result.put("client id", token.getClientId());
    // result.put("subaccount id", token.getSubaccountId());
    // result.put("zone id", token.getZoneId());
    // result.put("logon name", token.getLogonName());xxxxx
    // result.put("family name", token.getFamilyName());
    // result.put("given name", token.getGivenName());
    // result.put("email", token.getEmail());
    // result.put("authorities", String.valueOf(token.getAuthorities()));
    // result.put("scopes", String.valueOf(token.getScopes()));
    // return result;
    // }
}
