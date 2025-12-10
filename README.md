# pdf-generator

This project was generated using [Nx](https://nx.dev).

### [pdf-renderer](packages/pdf-renderer)

NestJS module used for creating PDF files out of react components.

### [invoice-template](packages/invoice-template)

Invoice templates created with react, can be used with pdf-renderer.

### [api-proxy](packages/api-proxy)

Used for authentication and communication with a [contractsgenerator](https://github.com/leancodepl/contractsgenerator)
based api.

### Dockerfile

At the top of your own Dockerfile add the following line.

`FROM ghcr.io/leancodepl/pdf-generator:[version]`

You can also easily get the current version, by using `latest`.

`FROM ghcr.io/leancodepl/pdf-generator:latest`


### Releasing packages to npm

To release a new version, run the following command:

```bash
npx nx run workspace:version --releaseAs=major
# or
npx nx run workspace:version --releaseAs=minor
# or
npx nx run workspace:version --releaseAs=patch
```

This will create a new commit and tag. Push the changes and the new tag to the remote repository. The tag's push will trigger the workflow.

### Releasing the dockerfile

To release the dockerfile, push a new tag with the prefix `docker-`, e.g.:

```bash
git tag docker-v0.1.0
git push origin docker-v0.1.0
```

This will trigger the workflow and push the new docker image to the Azure Container Registry.
