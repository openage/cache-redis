const redis = require('redis')

let options = {
    port: 6379,
    host: '127.0.0.1',
    options: {
        'maxmemory-policy': 'allkeys-lru',
        maxmemory: '1gb',
        enable_offline_queue: false
    }
}

const setOptions = (config) => {
    if (config.port) {
        options.port = config.port
    }

    if (config.host) {
        options.host = config.host
    }

    if (config['maxmemory-policy']) {
        options.options['maxmemory-policy'] = config['maxmemory-policy']
    }

    if (config.maxmemory) {
        options.options.maxmemory = config.maxmemory
    }
    if (config.password) {
        options.options.password = config.password
    }
}

exports.connect = (config) => {
    setOptions(JSON.parse(JSON.stringify(config)) || {})
    const client = redis.createClient(options.port, options.host, options.options)
    const set = async (key, value, ttl) => {
        client.set(key, JSON.stringify(value))
        client.expire(key, ttl)
    }

    const remove = (key) => {
        return new Promise((resolve, reject) => {
            client.keys(key, async (err, keys) => {
                if (!err) {
                    try {
                        for (let key of keys) {
                            let k = key
                            while (typeof k == "string") {
                                key = k
                                k = await get(key)
                            }
                            client.del(key)
                        }
                    } catch (err) { reject(err) }

                    resolve()
                } else {
                    reject(err)
                }

            })
        })
    }

    const get = (key) => {
        return new Promise((resolve, reject) => {
            client.get(key, function (err, reply) {
                if (err) {
                    reject(err)
                }
                resolve(JSON.parse(reply))
            })
        })
    }

    return {
        set: set,
        remove: remove,
        get: get
    }
}