# MMCFeatures

## Installation instructions

1) Install MongoDB
2) Then

```bash
npm install
```
3) Create config file
Example
```json
{
  "clientId": "xyz",
  "clientSecret": "mysecret",
  "token": null
}
```
## Usages instructions
1) Run MongoDB server
2) Fetch list of tagged songs from LastFm
```bash
node lastfm.js
node processLastfmResponse.js
```
3) Find Spotify Ids and then fetch Features.
```bash
node findSpids.js
node removeDupsFromSp.js
node getFeatures.js
```
4) Create CSV
```bash
node generateSchema.js
node generateCSV.js
```
