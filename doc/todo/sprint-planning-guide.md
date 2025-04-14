# VendorPro Sprint Planning Guide

## Sprint Planning Process

### Pre-Planning Preparation
1. Product Owner to review and refine the product backlog
2. Prioritize items in the backlog based on business value
3. Ensure all high-priority items have clear acceptance criteria
4. Review velocity from previous sprints to determine capacity

### Sprint Planning Meeting (2-4 hours)

#### Part 1: What will be delivered in this sprint? (1-2 hours)
1. Review the sprint goal
2. Present prioritized backlog items
3. Clarify requirements and acceptance criteria 
4. Determine which items can be completed in the sprint
5. Create initial sprint backlog

#### Part 2: How will the work be achieved? (1-2 hours)
1. Break down selected backlog items into specific tasks
2. Estimate effort for each task (4-5 hour chunks)
3. Identify dependencies between tasks
4. Assign initial tasks to team members
5. Confirm sprint capacity is not exceeded

### Sprint Backlog Creation
1. Document all tasks in the sprint backlog
2. Ensure each task has:
   - Clear description
   - Acceptance criteria
   - Effort estimate
   - Assigned team member
   - Priority level
3. Setup sprint board with appropriate columns (Todo, In Progress, Review, Done)

## Sprint Cadence

### Sprint Duration
- Each sprint lasts 2 weeks
- Starts on Monday and ends on Friday of the following week

### Regular Meetings
- **Daily Standup**: 15 minutes, every day at 10:00 AM
- **Sprint Review**: 1 hour, last Thursday of sprint at 2:00 PM
- **Sprint Retrospective**: 1 hour, last Friday of sprint at 10:00 AM
- **Sprint Planning**: 2-4 hours, first Monday of sprint at 10:00 AM

## Definition of Ready

A backlog item is ready for sprint planning when it:
1. Has a clear description
2. Has defined acceptance criteria
3. Is estimated by the team
4. Is understood by the team
5. Is small enough to be completed in a single sprint
6. Has no external dependencies that would block completion

## Definition of Done

A task is considered done when:
1. Code is written and meets acceptance criteria
2. Unit tests are written and passing
3. Code is reviewed by another team member
4. Documentation is updated
5. Changes are deployed to the testing environment
6. QA testing is completed with no critical bugs
7. Product Owner approves the implementation

## Sprint Planning Template

```
# Sprint [Number] Planning

## Sprint Goal
[Clear statement of what the team aims to achieve]

## Sprint Dates
Start: [Date]
End: [Date]

## Team Capacity
- Available team members: [List]
- Total capacity: [X] person-days
- Accounting for meetings and other activities: [Y] person-days
- Actual development capacity: [Z] person-days

## Selected Backlog Items
1. [Item 1] - Priority: [P0/P1/P2] - Effort: [Hours]
2. [Item 2] - Priority: [P0/P1/P2] - Effort: [Hours]
...

## Task Breakdown
### [Item 1]
- [ ] Task 1 - [Hours] - Assigned to: [Name]
- [ ] Task 2 - [Hours] - Assigned to: [Name]
...

### [Item 2]
- [ ] Task 1 - [Hours] - Assigned to: [Name]
- [ ] Task 2 - [Hours] - Assigned to: [Name]
...

## Dependencies
- [Task X] depends on [Task Y]
- External dependency: [Description]

## Risks and Mitigations
- Risk: [Description]
  - Mitigation: [Plan]
...
```

## Tips for Effective Sprint Planning

1. **Keep Focus on the Sprint Goal**: Every task should contribute to the sprint goal.

2. **Right-Size Tasks**: Tasks should be small enough to be completed in 4-5 hours. If a task is larger, break it down further.

3. **Buffer for Unknowns**: Don't plan to use 100% of capacity; leave buffer for unknowns and emergencies.

4. **Involve the Whole Team**: Everyone should participate in estimation and task breakdown.

5. **Clarify Immediately**: If something is unclear, address it during planning rather than during the sprint.

6. **Document Decisions**: Ensure all decisions, especially scope adjustments, are documented.

7. **Review Dependencies**: Identify and plan for both internal and external dependencies.

8. **Balance Skill Distribution**: Ensure tasks are distributed considering team members' skills and development goals. 