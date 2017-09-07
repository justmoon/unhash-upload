'use strict'

const fs = require('mz/fs')
const request = require('superagent')
const streamifier = require('streamifier')

const Plugin = require(process.env.UNHASH_ILP_PLUGIN || 'ilp-plugin-xrp-escrow')

// UNHASH_ILP_CREDENTIALS should look like this:
// {
//   secret: 'snGu...',
//   server: 'wss://s.altnet.rippletest.net:51233'
// }
const ilpCredentials = JSON.parse(process.env.UNHASH_ILP_CREDENTIALS)

const maxPrice = 100

const plugin = new Plugin(ilpCredentials)

require('superagent-ilp')(request, plugin)

const HOSTS = (process.env.UNHASH_HOSTS && JSON.parse(process.env.UNHASH_HOSTS)) || [
  'https://unhash.link'
]

const uploadFromStream = (stream, opts) => {
  // Upload to all of the hosts
  return Promise.all(HOSTS.map(host => {
    // Look up the upload URI from metadata
    return getUploadUri(host)
      .then(uri => {
        // POST the actual file buffer
        const req = request
          .post(uri)
          .pay(maxPrice)
          .type('application/octet-stream')

        stream.pipe(req, { end: false })

        return new Promise(resolve => stream.on('end', () => resolve(req)))
      })
      .then(res => {
        // For each result, let's add the hostname as a property
        return {
          host,
          uri: host + '/' + res.body.digest
        }
      })
  }))
    .then(hosts => {
      return {
        hosts
      }
    })
}

const uploadFromBuffer = (buffer, opts) => {
  // Upload to all of the hosts
  return Promise.all(HOSTS.map(host => {
    // Look up the upload URI from metadata
    return getUploadUri(host)
      .then(uri => {
        // POST the actual file buffer
        return request
          .post(uri)
          .send(buffer)
          .pay(maxPrice)
          .type('application/octet-stream')
      })
      .then(res => {
        // For each result, let's add the hostname as a property
        return {
          host,
          uri: host + '/' + res.body.digest
        }
      })
  }))
    .then(hosts => {
      return {
        hosts
      }
    })

  return uploadFromStream(streamifier.createReadStream(buffer), opts)
}

const uploadFromFile = (filename, opts) => {
  // const stream = fs.createReadStream(filename)
  // return uploadFromStream(stream, opts)
  const buffer = fs.readFileSync(filename)
  return uploadFromBuffer(buffer, opts)
}

const getUploadUri = host => {
  return request
    .get(`${host}/.well-known/unhash.json`)
    .then(res => {
      return res.body.upload
    })
}

Object.assign(exports, {
  uploadFromStream,
  uploadFromBuffer,
  uploadFromFile,
  getUploadUri
})
