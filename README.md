
## tool-sns-monitoring
Web GUI to monitor and replay messages for an SNS topic.

### Features
  * Monitor in real-time incoming messages
  * Edit the content of a message before replaying it
  * Pin favorites, useful, typical payloads for easy access

### Screenshots
#### Settings
![Settings page](/screenshots/settings.png?raw=true "Optional Title")
#### Homepage
![Homepage](/screenshots/homepage.png?raw=true "Optional Title")
#### Edit and replay modal
![Edit and replay a message modal](/screenshots/edit-replay.png?raw=true "Optional Title")

### Usage
```shell
yarn
yarn build
yarn global add serve
serve -s -l 3000 build
# Go to localhost:3000
```
