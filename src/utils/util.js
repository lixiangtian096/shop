
//获取云数据库集合
export default class Cloud{
    constructor(base, colle){
        this.db=wx.cloud.database({
            env: base
        })
        this.collect = this.db.collection(colle)
    }
    //选取集合
    getCollece= function (colle) {
        this.collect = this.db.collection(colle)
    }
    //查
    getData= (payload)=>{
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
    addData=(payload)=>{
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
    deleteData= (query)=> {
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
    upData= (query, newData) =>{
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
};

