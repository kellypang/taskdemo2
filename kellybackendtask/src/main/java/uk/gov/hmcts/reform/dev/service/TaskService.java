package uk.gov.hmcts.reform.dev.service;

import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import uk.gov.hmcts.reform.dev.constants.TaskConstants;
import uk.gov.hmcts.reform.dev.dto.request.TaskRequest;
import uk.gov.hmcts.reform.dev.dto.response.TaskResponse;
import uk.gov.hmcts.reform.dev.entity.TaskEntity;
import uk.gov.hmcts.reform.dev.exception.DatabaseWriteException;
import uk.gov.hmcts.reform.dev.exception.ResourceNotFoundException;
import uk.gov.hmcts.reform.dev.mapper.TaskMapper;
import uk.gov.hmcts.reform.dev.repository.TaskRepository;
import uk.gov.hmcts.reform.dev.repository.TaskSpecifications;

/**
 * Core business service orchestrating task persistence and transformations.
 *
 * <p>Acts as a boundary isolating controllers from repository & mapping concerns. Also the proper
 * home for future cross-cutting rules such as status transition validation.
 */
@Service
public class TaskService {
  private final TaskRepository taskRepository;
  private final TaskMapper taskMapper;
  private static final Logger log = LoggerFactory.getLogger(TaskService.class);

  public TaskService(TaskRepository taskRepository, TaskMapper taskMapper) {
    this.taskRepository = taskRepository;
    this.taskMapper = taskMapper;
  }

  /**
   * Helper method to find a task by ID or throw ResourceNotFoundException.
   *
   * @param id the task ID to find
   * @return the found TaskEntity
   * @throws ResourceNotFoundException if task with given ID doesn't exist
   */
  private TaskEntity findTaskOrThrow(Long id) throws ResourceNotFoundException {
    return taskRepository
        .findById(id)
        .orElseThrow(
            () -> new ResourceNotFoundException(String.format(TaskConstants.TASK_NOT_FOUND, id)));
  }

  // Create Task
  public TaskResponse createTask(TaskRequest taskRequest) {
    try {
      TaskEntity taskEntity = taskMapper.toEntity(taskRequest);
      TaskEntity savedTask = taskRepository.save(taskEntity);
      return taskMapper.toResponse(savedTask);
    } catch (DataAccessException exception) {
      // Provide underlying cause details in logs for diagnostics while keeping client
      // message stable
      log.error(
          "Database write failure while creating task: {}", exception.getMessage(), exception);
      throw new DatabaseWriteException(TaskConstants.DATABASE_WRITE_ERROR, exception);
    }
  }

  // Get Task by Id
  public TaskResponse getTaskById(Long id) throws ResourceNotFoundException {
    TaskEntity entity = findTaskOrThrow(id);
    return taskMapper.toResponse(entity);
  }

  public TaskResponse updateTask(Long id, TaskRequest taskRequest)
      throws ResourceNotFoundException {
    TaskEntity existing = findTaskOrThrow(id);

    // Map updates from request to the entity
    existing.setTitle(taskRequest.getTitle());
    existing.setDescription(taskRequest.getDescription());
    existing.setStatus(taskRequest.getStatus());
    existing.setDueDate(taskRequest.getDueDate());

    TaskEntity saved = taskRepository.save(existing);
    return taskMapper.toResponse(saved);
  }

  public void deleteTask(Long id) throws ResourceNotFoundException {
    TaskEntity task = findTaskOrThrow(id);
    taskRepository.delete(task);
  }

  public List<TaskResponse> getAllTasks() {
    List<TaskEntity> tasks = taskRepository.findAll();
    return tasks.stream().map(taskMapper::toResponse).collect(Collectors.toList());
  }

  // Update only the status
  public TaskResponse updateTaskStatus(Long id, uk.gov.hmcts.reform.dev.models.Status status)
      throws ResourceNotFoundException {
    TaskEntity entity = findTaskOrThrow(id);
    entity.setStatus(status);
    TaskEntity saved = taskRepository.save(entity);
    return taskMapper.toResponse(saved);
  }

  // Filter by status
  public List<TaskResponse> getTasksByStatus(uk.gov.hmcts.reform.dev.models.Status status) {
    return taskRepository.findByStatus(status).stream()
        .map(taskMapper::toResponse)
        .collect(Collectors.toList());
  }

  // Overdue tasks
  public List<TaskResponse> getOverdueTasks(java.time.LocalDateTime now) {
    return taskRepository.findByDueDateBefore(now).stream()
        .map(taskMapper::toResponse)
        .collect(Collectors.toList());
  }

  // Search using JPA Specifications for efficient database-level filtering
  public List<TaskResponse> searchTasks(
      String title, uk.gov.hmcts.reform.dev.models.Status status, java.time.LocalDate dueDate) {
    return taskRepository.findAll(TaskSpecifications.search(title, status, dueDate)).stream()
        .map(taskMapper::toResponse)
        .collect(Collectors.toList());
  }
}
