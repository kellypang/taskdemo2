package uk.gov.hmcts.reform.dev.support;

import org.junit.jupiter.api.AfterEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Base class for Postgres-backed E2E tests.
 *
 * <p>Responsibilities:
 *
 * <ul>
 *   <li>Provide a single static PostgreSQLContainer shared across all E2E test classes.
 *   <li>Inject datasource + Flyway properties so that migrations run against the container.
 *   <li>Ensure profile 'e2e' is active with its own PostgreSQL configuration.
 *   <li>Use random port to avoid conflicts with other running services.
 *   <li>Clean database after each test method to ensure test isolation.
 * </ul>
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("e2e")
public abstract class AbstractPostgresE2eTest {

  @Autowired(required = false)
  private JdbcTemplate jdbcTemplate;

  @SuppressWarnings("resource")
  public static final PostgreSQLContainer<?> POSTGRES;

  static {
    POSTGRES =
        new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("e2edb")
            .withUsername("e2euser")
            .withPassword("e2epass")
            .withReuse(true);
    POSTGRES.start();
  }

  @DynamicPropertySource
  static void postgresProps(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
    registry.add("spring.datasource.username", POSTGRES::getUsername);
    registry.add("spring.datasource.password", POSTGRES::getPassword);
    registry.add("spring.datasource.driverClassName", () -> "org.postgresql.Driver");
    // Let Flyway run normally (ENUM types, etc.)
    registry.add("spring.flyway.enabled", () -> "true");
    // Use 'update' during e2e testing to avoid failures if validation races
    // with Flyway
    // and to allow additive columns if migrations evolve. (If stricter checks
    // desired, revert to validate.)
    registry.add("spring.jpa.hibernate.ddl-auto", () -> "update");
    // Disable contextual LOB creation to avoid PostgreSQL createClob() issues
    registry.add("spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation", () -> "true");
  }

  /**
   * Clean up database after each test to ensure test isolation. This prevents data from one test
   * affecting another test.
   *
   * <p>This ensures that the "Create, list, update, search and delete task workflow" test runs
   * completely without interference from other tests.
   */
  @AfterEach
  void cleanupDatabase() {
    if (jdbcTemplate != null) {
      // Delete all data from task table after each test
      jdbcTemplate.execute("DELETE FROM task");
      // Reset the sequence for clean IDs in next test
      jdbcTemplate.execute("ALTER SEQUENCE task_id_seq RESTART WITH 1");
    }
  }
}
