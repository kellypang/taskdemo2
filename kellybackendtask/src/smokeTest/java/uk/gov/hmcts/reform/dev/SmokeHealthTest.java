package uk.gov.hmcts.reform.dev;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SmokeHealthTest {

  @LocalServerPort int port;

  private final TestRestTemplate rest = new TestRestTemplate();

  @Test
  @DisplayName("Smoke: context loads and root endpoint accessible")
  void rootEndpointReachable() {
    // Test root endpoint following the same pattern as backend tests
    ResponseEntity<String> root = rest.getForEntity("http://localhost:" + port + "/", String.class);
    assertThat(root.getStatusCode().is2xxSuccessful())
        .as("Root endpoint should return 2xx status")
        .isTrue();

    assertThat(root.getBody())
        .as("Root endpoint should contain welcome message")
        .contains("Welcome");
  }

  @Test
  @DisplayName("Smoke: info endpoint accessible")
  void infoEndpointReachable() {
    // Test info endpoint following the same pattern as backend tests
    ResponseEntity<String> info =
        rest.getForEntity("http://localhost:" + port + "/api/info", String.class);
    assertThat(info.getStatusCode().is2xxSuccessful())
        .as("Info endpoint should return 2xx status")
        .isTrue();
  }
}
