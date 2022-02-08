# AEN Tabletop Tooling

Tooling for "DND" AEN.

## Dependencies

- NodeJS (Must be 14.x, that's what Cloud Functions supports)
- Yarn

## Set Up Dev Environment

- `yarn install`

Make sure you run this command in both `root` and `functions`

- `yarn firebase login`
- Hopefully that's it!

See `package.json` for some useful commands (e.g. `yarn lint`, `yarn test`, `yarn build`, `yarn deploy`.....)

To commit changes, first make a local branch with your changes (this can be named anything) and push to `origin $your_new_branch_name`
Then, in the github web UI, click the `pull request` button next to your pending change and follow the instructions to merge with main
Note: finishing the pull request with `squash and merge` will delete your newly made branch on remote. This is usually desireable, but double check that it is the behavior you want.

## Testing

You can run all tests in the repo by running `yarn test`.

At time of writing, there's two flavors of tests:

- Unit tests: traditional unit tests run using `jest` with no dependencies on outside services. You can run
    `yarn test:unit` to run all of the unit tests. Alternatively, you can run `yarn test:unit-fast` to skip type checks
    but run the tests significantly faster.
- Firestore integrated tests: integrated tests run using `jest` that are dependent on Firestore. This spins up the
    Firestore emulator, and makes real calls to it in order to test against a "real" Firestore implementation.