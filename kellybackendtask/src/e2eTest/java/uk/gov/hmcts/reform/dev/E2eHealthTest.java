package uk.gov.hmcts.reform.dev;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;
import uk.gov.hmcts.reform.dev.support.AbstractPostgresE2eTest;

/**
 * End-to-end test verifying the application starts correctly with the e2e profile and the info
 * endpoint is accessible following the same pattern as backend tests.
 *
 * <p>This test extends AbstractPostgresE2eTest to use a real PostgreSQL database via Testcontainers
 * instead of H2 in-memory database.
 */
class E2eHealthTest extends AbstractPostgresE2eTest {

  @LocalServerPort int port;

  private final TestRestTemplate rest = new TestRestTemplate();

  @Test
  @DisplayName("E2E: Info endpoint accessible at /api/info")
  void infoEndpointAccessible() {
    String url = "http://localhost:" + port + "/api/info";
    ResponseEntity<String> response = rest.getForEntity(url, String.class);

    assertThat(response.getStatusCode().is2xxSuccessful())
        .as("Info endpoint should return 2xx status")
        .isTrue();

    assertThat(response.getBody())
        .as("Info response should contain application name")
        .contains("application");
  }

  @Test
  @DisplayName("E2E: Root endpoint accessible")
  void rootEndpointAccessible() {
    String url = "http://localhost:" + port + "/";
    ResponseEntity<String> response = rest.getForEntity(url, String.class);

    assertThat(response.getStatusCode().is2xxSuccessful())
        .as("Root endpoint should return welcome message")
        .isTrue();

    assertThat(response.getBody())
        .as("Root endpoint should return non-empty body")
        .isNotNull()
        .isNotEmpty();
  }
}
