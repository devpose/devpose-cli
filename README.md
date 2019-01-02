CLI to init a project starter.

## Usage

```
npm install -g devpose-cli
```

```
dp init <starter-name> to <app-name> --optionKey optionValue
```

### Run command without option

If we only run command `dp init <starter-name> to <app-name>`

`starter-name` will be a name of yaml config file, you can find all supported files at [posehub](https://github.com/devpose/posehub/tree/master/ymls)

For exmaple: `dp init node-react-docker to my-app`, it will create a project starter with configurations defined in [node-react-docker.yml](https://github.com/devpose/posehub/blob/master/ymls/node-react-docker.yml)

### Run command with options

There are two options supported currently:

**`--path`**

Use a local yaml file to init project starter

For exmaple: `dp init starter to my-app --path <path-to-a-local-yml-file>`

**`--link`**

When we default yaml files are at [posehub](https://github.com/devpose/posehub/tree/master/ymls), we can use `--link` to use a online yaml file hosted anywhere you want

For exmaple: `dp init starter to my-app --link <url-to-a-remote-yml-file>`
