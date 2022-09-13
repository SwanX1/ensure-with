<h1 align="center">ensure-with</h1>

### Description
**ensure-with** is a command-line utility for scripts to ensure necessary files are present before running a command.<br>
This isn't really a sophisticated piece of software, but it gets the job done.<br>
If you'd like to add more features to it, please do so, and read [the contribution guidelines](./CONTRIBUTING.md) first.<br>
This project contains no dependencies (except for prettier and eslint for development), and I'd like to keep it that way.

### Usage

```
$ ensure-with [path] [ensure-command] [exec-command]
```

Usage is quite simple, honestly. Just replace the required arguments with values.
 - `path` is the path that's checked if it exists.
 - `ensure-command` is the command that's run to create the path, it could be a build command or something that creates a cache file.
 - `exec-command` gets run when the path exists, or is created by the `ensure-command`

**For example:**
This command checks if a built index file exists, if not, it builds it, then runs it. Useful for TypeScript projects.
```
$ ensure-with "built/index.js" "npm run build" "node built/index.js"
```