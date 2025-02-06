# store-sweeper

### task list for api server

- [ ] explore https://github.com/n0madic/google-play-scraper and https://github.com/ngo275/app-store-client as alternatives to repositories provided for inspiration in the ticket
- [ ] set up docker compose for local testing
- [ ] decide response structure for `/search` endpoint
- [ ] implement endpoint
- [ ] add unit tests
- [ ] add logging


### Deploying

```
gcloud run deploy store-sweeper \
    --image gcr.io/decoded-theme-355014/store-sweeper \
    --platform managed \
    --region europe-west3 \
    --allow-unauthenticated
```
