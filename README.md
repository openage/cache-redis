# cache-redis
```json
{
    "dependencies": {
        "redis": "2.8.0"
    }
}
```
Add the logger-insight to logger `config.json`

```json
{
    "cache": {
    	"type": "@open-age/cache-redis",
        "config": {
            "port": 6379,
            "host": "127.0.0.1",
            "options": {
                "maxmemory-policy":" allkeys-lru",
                "maxmemory": "1gb",
                "enable_offline_queue": false,
            }
        }
    }
}
```
