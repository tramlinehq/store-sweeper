# store-sweeper

### task list for api server

- [x] set up docker compose for local testing
- [x] decide response structure for `/search` endpoint
- [x] implement endpoint across both app store and play store
- [x] add logging (request and error)
- [ ] add unit tests


### Deploying

```
gcloud run deploy store-sweeper \
    --image gcr.io/decoded-theme-355014/store-sweeper \
    --platform managed \
    --region europe-west3 \
    --allow-unauthenticated
```
