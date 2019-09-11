
//获取云数据库集合
export default class Cloud {
    constructor(base) {
        this.db = wx.cloud.database({
            env: base
        })
    }
    //选取集合
    getCollece = function (colle) {
        this.collect = this.db.collection(colle)
        return this
    }
    //查
    getData = (payload) => {
        return new Promise((resolve, reject) => {
            this.collect.where(payload).get({
                success: res => {
                    resolve(res)
                },
                fail: err => {
                    wx.showToast({
                        title: 'err',
                        icon: 'none'
                    })
                    reject(err)
                }
            })
        })
    }
    //增
    addData = (payload) => {
        return new Promise((resolve, reject) => {
            this.collect.add({
                data: payload,
                success: res => {
                    resolve(res)

                },
                fail: err => {
                    reject(err)
                    wx.showToast({
                        title: err,
                        icon: 'none'
                    })
                }
            })
        })
    }
    //删
    deleteData = (query) => {
        return new Promise((resolve, reject) => {
            this.collect.doc(query).remove({
                success: res => {
                    resolve(res)
                },
                fail: err => {
                    reject(err)
                    wx.showToast({
                        icon: 'none',
                        title: err,
                    })
                }
            })
        })
    }
    //改
    upData = (query, newData) => {
        return new Promise((resolve, reject) => {
            this.collect.doc(query).update({
                data: newData,
                success: res => {
                    resolve(res)
                },
                fail: err => {
                    wx.showToast({
                        title: err,
                        icon: 'none'
                    })
                    reject(err)
                }
            })
        })
    }
    uploadFile = (filePath,cloudPath) => {
        return new Promise((rs, rj) => {
            wx.cloud.uploadFile({
                cloudPath:cloudPath, // 上传至云端的路径
                filePath:filePath, // 小程序临时文件路径
                success: res => {
                    rs(res.fileID)
                },
                fail: err=>{
                    rj(err)
                }
            })
        })
    }
};