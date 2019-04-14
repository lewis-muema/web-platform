<!--See the general documentation guidelines https://docs.gitlab.com/ee/development/documentation -->

## What does this MR do?

<!-- Briefly describe what this MR is about -->

## Related issues

<!-- Mention the issue(s) this MR closes or is related to -->

Closes

## General checklist

- [ ] Conforms to the [javascript style guidelines](https://github.com/airbnb/javascript)
- [ ] Conforms to the [css style guidelines](http://getbem.com/)
- [ ] [Changelog entry]() added, if necessary
- [ ] [Documentation created/updated]()
- [ ] [Tests added for this feature/bug]()
- [ ] Conforms to the [code review guidelines]()
- [ ] Conforms to the [merge request performance guidelines]()

## Database checklist

When updating existing columns:

- [ ] Added the new schema to the MR body
- [ ] Added a description of the changes made

When adding or modifying queries to improve performance:

- [ ] Included data that shows the performance improvement, preferably in the form of a benchmark
- [ ] Included the output of `EXPLAIN (ANALYZE, BUFFERS)` of the relevant queries

When adding tables:

- [ ] Added indexes for fields that are used in statements such as WHERE, ORDER BY, GROUP BY, and JOINs

When removing columns, tables, indexes or other structures:

- [ ] Made sure the application and any other applications no longer uses (or ignores) these structures

## Author's checklist

- [ ] Unit Tests Passed (required)
- [ ] Documentation done

## Review checklist

- [ ] Your team's review (required)

/label ~web
