## Tool to upload the csv file to extractor
- Install node.
- npm
- install dependency if any required


### Run server.js
It will start localhost running at port 3000.
```
https://localhost:3000
```

### Uploading file
- Convert csv files to NDJson files
- Max default file that can be processed/uploaded count is 15. Can be configured from the env variable
- Hit upload button

It will take you to another page
<a name="https://localhost:3000/multiple-upload">https://localhost:3000/multiple-upload</a>

### Providing extractor information
- Adding extractor Id, and name of the column header from the csv that need to be mapped as _url, and other option can also be added.
- Hit **Post Data To Extractor** button
- Wait for a while, you will get alert dialogue, if the input will be uploaded successfully
