//生成文件夹名称
const getUploadDir = () => {
  const date = new Date();
  let month = date.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 10 ? `0${day}` : day;
  const dir = `${date.getFullYear()}${month}${day}`;
  return dir;
};

module.exports = getUploadDir;