# QualWeb tests

<https://github.com/qualweb>

QualWeb CLI: <https://github.com/qualweb/cli#qualweb-cli>

```sh
docker compose pull
docker compose up --detach
```

Generate [EARL Report](https://www.w3.org/WAI/standards-guidelines/act/report/earl/) `reports/localhost.earl-a.json` for
the urls listed in [`test/test.urls`](test/test.urls):

```sh
docker compose run --rm qualweb qw --report-type earl-a --save-name reports/localhost.earl-a.json --file test/test.urls
```

Render report in a concise text format:

```sh
docker compose run --rm qualweb earl2txt reports/localhost.earl-a.json
```

## Coding standards

```sh
npm run coding-standards-check
```

```sh
npm run coding-standards-apply
```
