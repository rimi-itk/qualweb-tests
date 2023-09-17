# QualWeb tests

<https://github.com/qualweb>

QualWeb CLI: <https://github.com/qualweb/cli#qualweb-cli>

```sh
docker compose pull
docker compose up --build --detach
```

Generate aggregated [EARL Report](https://www.w3.org/WAI/standards-guidelines/act/report/earl/)
`reports/localhost.earl-a.json` for the urls listed in [`test/test.urls`](test/test.urls):

```sh
docker compose run --rm qualweb qw --report-type earl-a --save-name reports/localhost.earl-a.json --file test/test.urls
```

Render report in a concise text format:

```sh
docker compose run --rm qualweb earl2txt reports/localhost.earl-a.json
```

Access site running on docker host (service `nginx` exposed on port `8080`):

```sh
docker compose run --rm qualweb qw --report-type earl-a --save-name reports/localhost.earl-a.json --url "http://host.docker.internal:$(docker compose port nginx 8080 | cut -d: -f2)"
```

## Report overview

Get URL and metadata for all reports (`http*.json`):

```sh
for f in http*.json; do docker run --rm --interactive efrecon/jq:1.7 '{completeUrl: .system.url.completeUrl, uri: .system.url.uri, metadata: .metadata}' < $f; done
```

Set exit status to `1` if a test has failed:

```sh
./bin/check http*.json; echo $?
```

```sh
$(for f in http*.json; do docker run --rm --interactive efrecon/jq:1.7 --exit-status '.metadata.failed == 0' < $f || exit 1; done); echo $?
```

## Coding standards

```sh
npm run coding-standards-check
```

```sh
npm run coding-standards-apply
```
