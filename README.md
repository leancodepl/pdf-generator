# pdf-generator

This project was generated using [Nx](https://nx.dev).

### [pdf-renderer](https://github.com/leancodepl/pdf-generator/tree/main/packages/pdf-renderer)

NestJS module used for creating PDF files out of react components.

### [invoice-template](https://github.com/leancodepl/pdf-generator/tree/main/packages/invoice-template)

Invoice templates created with react, can be used with pdf-renderer.

### [api-proxy](https://github.com/leancodepl/pdf-generator/tree/main/packages/api-proxy)

Used for authentication and communication with a [contractsgenerator](https://github.com/leancodepl/contractsgenerator)
based api.

### Dockerfile

At the top of your own Dockerfile add the following line.

`FROM ghcr.io/leancodepl/pdf-generator:[version]`

You can also easily get the current version, by using `latest`.

`FROM ghcr.io/leancodepl/pdf-generator:latest`
