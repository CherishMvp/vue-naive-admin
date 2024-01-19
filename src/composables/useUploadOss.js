import axios from 'axios'

/**
 * @typedef {Object} OssData
 * @property {string} accessId - OSS 的 AccessKeyId
 * @property {string} policy - OSS 的上传策略
 * @property {string} signature - 对上传策略签名后的字符串
 * @property {string} callback - OSS 上传回调地址
 * @property {string} dir - 存储文件的目录名
 * @property {string} host - OSS 的上传域名
 */

/**
 * 上传文件到 OSS
 * @param {File} file - 要上传的文件对象
 * @returns {Promise<string>} - 返回 Promise 对象，用于获取上传后的文件在 OSS 中的 URL
 */
const uploadFileToOSS = async (file) => {
  /** @type {string} */
  let imgUrl = ''
  let fileNameReturn = ''
  // 获取上传签名
  const getOssData = async () => {
    const res = await axios.get('https://ai-miniprogram.fancyzh.top/oss/signature')
    console.log('OSS 签名接口数据', res.data)
    return res.data.data
  }

  // 生成文件名，作为 key 使用
  const generateFileName = (ossData, file) => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'))
    const filename = Date.now() + suffix
    return ossData.dir + filename
  }

  // 使用 Policy 和签名上传图片到 OSS
  const handleUpload = async () => {
    const ossData = await getOssData()

    const key = generateFileName(ossData, file)

    const formdata = new FormData()

    // 注意参数的顺序，key 必须是第一位，表示 OSS 存储文件的路径
    formdata.append('key', key) // key 是 oss 中文件的存储路径，包括文件名
    formdata.append('OSSAccessKeyId', ossData.accessId)
    formdata.append('policy', ossData.policy)
    formdata.append('signature', ossData.signature)
    // 设置回调信息
    formdata.append('callback', ossData.callback)
    // 文件上传成功默认返回 204 状态码，可根据需要修改为 200
    // formdata.append('success_action_status', '200')
    // file 必须放在最后一位
    formdata.append('file', file)
    console.log('oss 相关参数', ossData)
    // ossData.host = 'https://miniprogram.fancyzh.top/cherish-bucket';
    const res = await axios.post(ossData.host, formdata)
    console.log('res', res)
    console.log('key', key)
    if (res.status === 200) {
      console.log('自定义回调内容', res.data?.data)
      // 前端拼接文件地址
      imgUrl = ossData.host + '/' + key
      fileNameReturn = res.data?.data.file.filename
    }
  }

  await handleUpload()
  return { fileName: fileNameReturn, url: imgUrl }
}

export default uploadFileToOSS
