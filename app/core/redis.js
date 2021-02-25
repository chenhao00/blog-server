const Redis = require('ioredis');
const redis = new Redis();

class Store {
  constructor(key, options) {
    this.redis = redis;
    this.key = key || 'TOKEN-';
    this.options = {
      timeout: 3600 * 24 * 7,
      ...options
    }
  }
  //获取
  async get(id) {
    let res = JSON.parse(await this.redis.get(this.key + id));
    if (res !== null && this.key === 'TOKEN-' && (Date.parse(new Date()) / 1000 - res.time > this.options.timeout)) {
      await this.destory(id);
      return null;
    }
    return res;
  }
  //设置
  async set(id, val) {
    return await this.redis.set(this.key + id, JSON.stringify(val));
  }
  //删除
  async destory(id) {
    return await this.redis.del(this.key + id);
  }
}

module.exports = Store;