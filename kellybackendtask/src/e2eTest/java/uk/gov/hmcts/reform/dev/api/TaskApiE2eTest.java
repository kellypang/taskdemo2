package uk.gov.hmcts.reform.dev.api;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uk.gov.hmcts.reform.dev.dto.request.TaskRequest;
import uk.gov.hmcts.reform.dev.dto.response.TaskResponse;
import uk.gov.hmcts.reform.dev.models.Status;
import uk.gov.hmcts.reform.dev.support.AbstractPostgresE2eTest;

/**
 * End-to-end API tests using Testcontainers PostgreSQL database. Tests the complete task management
 * workflow from creation to deletion.
 *
 * <p>This test extends AbstractPostgresE2eTest to use a real PostgreSQL database via Testcontainers
 * instead of H2 in-memory database, providing more realistic end-to-end validation.
 */
class TaskApiE2eTest extends AbstractPostgresE2eTest {

  @LocalServerPort int port;
  @Autowired TestRestTemplate rest;

  private String baseUrl() {
    return "http://localhost:" + port + "/api/tasks";
  }

  @Test
  @DisplayName("E2E: Create, list, update, search and delete task workflow")
  void completeTaskWorkflow() {
    // 1. Create a new task
    TaskRequest createRequest =
        TaskRequest.builder()
            .title("E2E Test Task")
            .description("Testing end-to-end workflow")
            .status(Status.NEW)
            .dueDate(LocalDateTime.now().plusDays(7))
            .build();

    ResponseEntity<TaskResponse> createResponse =
        rest.postForEntity(baseUrl(), createRequest, TaskResponse.class);

    assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(createResponse.getBody()).isNotNull();

    TaskResponse createdTask = createResponse.getBody();
    assertThat(createdTask.getId()).isNotNull();
    assertThat(createdTask.getTitle()).isEqualTo("E2E Test Task");
    assertThat(createdTask.getStatus()).isEqualTo(Status.NEW);

    Long taskId = createdTask.getId();

    // 2. List all tasks and verify our task is present
    ResponseEntity<List<TaskResponse>> listResponse =
        rest.exchange(
            baseUrl(),
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<TaskResponse>>() {});

    assertThat(listResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(listResponse.getBody()).isNotNull();
    assertThat(listResponse.getBody())
        .as("Task list should contain our created task")
        .anyMatch(t -> t.getId().equals(taskId));

    // 3. Get task by ID
    ResponseEntity<TaskResponse> getResponse =
        rest.getForEntity(baseUrl() + "/" + taskId, TaskResponse.class);

    assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(getResponse.getBody()).isNotNull();
    assertThat(getResponse.getBody().getId()).isEqualTo(taskId);

    // 4. Update the task
    TaskRequest updateRequest =
        TaskRequest.builder()
            .title("E2E Test Task - Updated")
            .description("Updated description")
            .status(Status.IN_PROGRESS)
            .dueDate(LocalDateTime.now().plusDays(14))
            .build();

    rest.put(baseUrl() + "/" + taskId, updateRequest);

    ResponseEntity<TaskResponse> updatedResponse =
        rest.getForEntity(baseUrl() + "/" + taskId, TaskResponse.class);

    assertThat(updatedResponse.getBody()).isNotNull();
    assertThat(updatedResponse.getBody().getTitle()).isEqualTo("E2E Test Task - Updated");
    assertThat(updatedResponse.getBody().getStatus()).isEqualTo(Status.IN_PROGRESS);

    // 5. Search for the task
    ResponseEntity<List<TaskResponse>> searchResponse =
        rest.exchange(
            baseUrl() + "/search?title=Updated",
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<List<TaskResponse>>() {});

    assertThat(searchResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    assertThat(searchResponse.getBody()).isNotNull();
    assertThat(searchResponse.getBody())
        .as("Search results should contain our updated task")
        .anyMatch(t -> t.getId().equals(taskId));

    // 6. Delete the task
    rest.delete(baseUrl() + "/" + taskId);

    ResponseEntity<String> deletedResponse =
        rest.getForEntity(baseUrl() + "/" + taskId, String.class);

    assertThat(deletedResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
  }

  @Test
  @DisplayName("E2E: API returns 404 for non-existent task")
  void getNonExistentTask() {
    ResponseEntity<String> response = rest.getForEntity(baseUrl() + "/999999", String.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
  }

  @Test
  @DisplayName("E2E: API validates required fields")
  void createTaskWithMissingFields() {
    TaskRequest invalidRequest = TaskRequest.builder().build();

    ResponseEntity<String> response = rest.postForEntity(baseUrl(), invalidRequest, String.class);

    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
  }
}
