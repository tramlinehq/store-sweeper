# store-sweeper

### task list for api server

- [x] decide response structure for `/search` endpoint
- [x] implement endpoint across both app store and play store
- [x] set up docker compose for local testing
- [x] add logging (request and error)
- [ ] add unit tests

### Local Dev

```sh
$ docker compose up --build
```

Connect on http://localhost:7001 with the API. `/search` and `/healthz` are the endpoints that are available now.

### Deploying

```
gcloud run deploy store-sweeper \
    --image gcr.io/decoded-theme-355014/store-sweeper \
    --platform managed \
    --region europe-west3 \
    --allow-unauthenticated
```
