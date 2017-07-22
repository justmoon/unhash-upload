'use strict'

const fs = require('mz/fs')
const fetch = require('node-fetch')

const HOSTS = [
  // 'https://unhash.link',
  'https://unhash.s3.amazonaws.com'
]

const uploadFromBuffer = (buffer, opts) => {
  // Upload to all of the hosts
  return Promise.all(HOSTS.map(host => {
    // Look up the upload URI from metadata
    return getUploadUri(host)
      .then(uri => {
        // POST the actual file buffer
        return fetch(uri, {
          method: 'POST',
          body: buffer
        })
      })
      .then(res => res.json())
      .then(json => {
        // For each result, let's add the hostname as a property
        return Object.assign({}, json, {
          host
        })
      })
  }))
    .then(hosts => {
      return {
        hosts
      }
    })
}

const uploadFromFile = (filename, opts) => {
  return fs.readFile(filename)
    .then(contents => uploadFromBuffer(contents, opts))
}

const getUploadUri = host => {
  return fetch(`${host}/.well-known/unhash.json`)
    .then(res => res.json())
    .then(json => {
      return json.upload
    })
}

Object.assign(exports, {
  uploadFromBuffer,
  uploadFromFile,
  getUploadUri
})
