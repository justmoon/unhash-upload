# Unhash Upload Client

## Installation

``` sh
npm install --save unhash-upload
```

## Usage

### uploadFileFromBuffer

``` js
const upload = require('unhash-upload')

upload.uploadFromBuffer(new Buffer('example'))
  .then((res) => {
    // res = {
    //   hosts: [{
    //     digest: 'UNhY4JhezH9gQYqvDMWrWH9CwlcKiECVqejMrND2VFw',
    //     uri: 'https://unhash.s3.amazonaws.com/UNhY4JhezH9gQYqvDMWrWH9CwlcKiECVqejMrND2VFw',
    //     host: 'unhash.s3.amazonaws.com'
    //   }]
    // }
  }, (err) => console.error(err))
```

### uploadFromFile

``` js
const upload = require('unhash-upload')

upload.uploadFromFile('package.json')
  .then((res) => {
    // res = {
    //   hosts: [{
    //     digest: 't5Rqu_9wwy4DXHUhqKJ2PzgNhP0hpjIOIux0piT94GI',
    //     uri: 'https://unhash.s3.amazonaws.com/t5Rqu_9wwy4DXHUhqKJ2PzgNhP0hpjIOIux0piT94GI',
    //     host: 'unhash.s3.amazonaws.com'
    //   }]
    // }
  }, (err) => console.error(err))
```
