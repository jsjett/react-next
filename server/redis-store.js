function getRedisKey(key) {
    return `jett-session:${key}`
}


class RedisStore {
    constructor(client){
        this.redisClient = client;
    }

    /**
     * 获取redis里存储的数据
     */
    async get(sid){
        const id = getRedisKey(sid);
        const data = await this.redisClient.get(id);
        if(!data){
            return null;
        }else {
            try {
                return JSON.parse(data);
            }catch (e) {
                console.error(e);
            }
        }
    }

    /**
     * 设置数据到redis里面
     */
    async set(sid,sess,ttl){
         const id = getRedisKey(sid);
         if(typeof ttl === 'number'){
             ttl = Math.ceil(ttl / 1000);
         }
         try {
            const sessStr = JSON.stringify(sess);
            if(ttl){
                await this.redisClient.setex(id,ttl,sessStr);
            }else {
                await this.redisClient.set(id,sessStr);
            }
         }catch (e) {
             consoel.error();
         }
    }

    /**
     * 删除redis里面的值
     */
    async destroy(sid){
        const id = getRedisKey(sid);
        try {
            await this.redisClient.del(id);
        }catch (e) {
            console.error(e);
        }

    }
}

module.exports = RedisStore;
