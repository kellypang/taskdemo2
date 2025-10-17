package uk.gov.hmcts.reform.dev.repository;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import uk.gov.hmcts.reform.dev.entity.TaskEntity;
import uk.gov.hmcts.reform.dev.models.Status;

/**
 * JPA Specifications for building dynamic queries on TaskEntity.
 *
 * <p>Enables efficient database-level filtering instead of loading all records into memory. Each
 * method returns a Specification that can be combined with others using and/or operations.
 */
public class TaskSpecifications {

  /**
   * Creates a specification for searching tasks by multiple optional criteria.
   *
   * @param title Optional title search (case-insensitive partial match)
   * @param status Optional status filter (exact match)
   * @param dueDate Optional due date filter (exact date match)
   * @return Specification that combines all provided criteria with AND logic
   */
  public static Specification<TaskEntity> search(String title, Status status, LocalDate dueDate) {
    return (root, query, criteriaBuilder) -> {
      List<Predicate> predicates = new ArrayList<>();

      // Title filter - case-insensitive partial match
      if (title != null && !title.isBlank()) {
        predicates.add(
            criteriaBuilder.like(
                criteriaBuilder.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
      }

      // Status filter - exact match
      if (status != null) {
        predicates.add(criteriaBuilder.equal(root.get("status"), status));
      }

      // Due date filter - match tasks with due date on the specified date
      if (dueDate != null) {
        LocalDateTime startOfDay = dueDate.atStartOfDay();
        LocalDateTime endOfDay = dueDate.plusDays(1).atStartOfDay();
        predicates.add(criteriaBuilder.between(root.get("dueDate"), startOfDay, endOfDay));
      }

      return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    };
  }

  /**
   * Specification for finding tasks by status.
   *
   * @param status The status to filter by
   * @return Specification for status filtering
   */
  public static Specification<TaskEntity> hasStatus(Status status) {
    return (root, query, criteriaBuilder) ->
        status == null ? null : criteriaBuilder.equal(root.get("status"), status);
  }

  /**
   * Specification for finding overdue tasks.
   *
   * @param now Current date/time for comparison
   * @return Specification for overdue tasks
   */
  public static Specification<TaskEntity> isOverdue(LocalDateTime now) {
    return (root, query, criteriaBuilder) -> criteriaBuilder.lessThan(root.get("dueDate"), now);
  }

  /**
   * Specification for finding tasks with title containing the search term.
   *
   * @param searchTerm Search term for partial matching (case-insensitive)
   * @return Specification for title search
   */
  public static Specification<TaskEntity> titleContains(String searchTerm) {
    return (root, query, criteriaBuilder) -> {
      if (searchTerm == null || searchTerm.isBlank()) {
        return null;
      }
      return criteriaBuilder.like(
          criteriaBuilder.lower(root.get("title")), "%" + searchTerm.toLowerCase() + "%");
    };
  }

  /**
   * Specification for finding tasks due within a date range.
   *
   * @param start Start of date range (inclusive)
   * @param end End of date range (exclusive)
   * @return Specification for date range filtering
   */
  public static Specification<TaskEntity> dueDateBetween(LocalDateTime start, LocalDateTime end) {
    return (root, query, criteriaBuilder) ->
        criteriaBuilder.between(root.get("dueDate"), start, end);
  }
}
