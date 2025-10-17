package uk.gov.hmcts.reform.dev.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.hmcts.reform.dev.constants.TaskConstants;
import uk.gov.hmcts.reform.dev.models.Status;

/**
 * DTO representing the client-supplied data to create or update a task.
 *
 * <p>Bean Validation annotations enforce required business constraints before reaching the service
 * layer.
 */
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class TaskRequest {
  @NotBlank(message = TaskConstants.TITLE_REQUIRED)
  private String title;

  private String description;

  @NotNull(message = TaskConstants.STATUS_REQUIRED)
  private Status status;

  @NotNull(message = TaskConstants.DUE_DATE_REQUIRED)
  @Future(message = TaskConstants.DUE_DATE_FUTURE)
  private LocalDateTime dueDate;

  private Integer tasknum;
}
