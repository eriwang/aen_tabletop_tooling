# AEN Tabletop Tooling

Tooling for "DND" AEN.

## Dependencies

- NodeJS (Initially developed using v16.13.0)
- Yarn
- [Clasp](https://github.com/google/clasp#install)

## Set Up Dev Environment

Note that this is mostly (if not all) automatable, and one day could be put into a shell script.

- Copy the `aen_tabletop_tooling_base` file in Drive to your personal Drive
    - Note that this is a file private to our group for now, we may make it public in the future
- `yarn install`
- `clasp login`
- `clasp create --title aen_tabletop_testing --parentId <id_of_your_sheet>`
- `clasp push` (or use `--watch` if it works on your system)

### Testing

- `yarn jest`
- You currently cannot test Google Apps Script code (there's likely a way to mock that, but it hasn't been explored)

### Linting

- `yarn lint`, optionally add `--fix`