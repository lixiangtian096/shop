import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button, Text, Input, Radio, RadioGroup, Label, Navigator} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Cloud from '../../utils/util'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Issues {
  props: IProps;
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add() {
    dispatch(add())
  },
  dec() {
    dispatch(minus())
  },
  asyncAdd() {
    dispatch(asyncAdd())
  }
}))
class Issues extends Component {

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  constructor() {
    super()
    this.state = {
      cloud: new Cloud('shop-mqydt'),
      typeList: [],
      statusList: [
        { name: '新品', key: "1" },
        { name: '普通', key: "2" },
      ],
      name: '',
      price: '',
      about: '',
      status: '',
      type: '',
      showimages: [],
      images: [],

    }
  }
  config: Config = {
    navigationBarTitleText: '发布藏品'
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  componentDidMount() {
    const { cloud } = this.state
    cloud.getCollece('typeList').getData({}).then(res => {
      console.log(res)
      this.setState({
        typeList: res.data
      })
    })
  }

  setName = (e) => {
    this.setState({
      name: e.target.value
    })
  }
  setStatus = (e) => {
    this.setState({
      status: e.target.value
    })
  }
  setAbout = (e) => {
    this.setState({
      about: e.target.value
    })
  }
  setPrice = (e) => {
    this.setState({
      price: e.target.value
    })
  }
  setType = (e) => {
    console.log(e)
    this.setState({
      type: e.target.value
    })
  }
  upImage = () => {
    const { cloud } = this.state
    Taro.chooseImage({}).then(res => {
      let pL = []
      this.setState({
        showimages: res.tempFilePaths
      })
      res.tempFilePaths.forEach((item, idx) => {
        pL.push(cloud.uploadFile(item, 'qwe' + Math.random(0, 1)).then(res => {
          let { images } = this.state
          images.push(res)
          this.setState({
            images
          })
        }))
      })
      if (pL.length > 0) {
        Promise.all(pL).then(res => {
          // console.log(123)
        })
      }
    })
  }
  summbit = () => {
    const { name, status, about, price, cloud, type, images} = this.state
    console.log(name, status, about, price, type)
    if (!name || !status || !about || !price || !type ||images.length<1) {
      Taro.showToast({
        title: '检查信息是否完整',
        icon: 'none',
        duration: 2000
      })
      return
    }
    cloud.getCollece('goods').addData({ name, status, about, price, type, images, date:new Date()}).then(res => {
      Taro.showToast({
        title: '上传成功',
        icon: 'success',
        duration: 2000
      })
    })
  }

  render() {
    const { typeList, statusList, type, status} = this.state
    return (
      <View className='index'>
        <View className="list"><Text>藏品名称:</Text><View className="label"><Input onInput={this.setName} /></View></View>
        <View className="list">
          <Text>藏品分类:</Text>
          <View className="label nobod">
            <RadioGroup onChange={this.setType}>
              {typeList.map((item, i) => {
                return (<Label className='radio-list__label' for={i}>
                  <Radio className='radio-list__radio' value={item.key} checked={item.key==type}>{item.name}</Radio>
                </Label>)
              })}
            </RadioGroup>
          </View></View>
        <View className="list"><Text>藏品简介:</Text><View className="label nobod"><Textarea onInput={this.setAbout} style='background:#fff;width:100%;min-height:80px;padding:0 30rpx;' autoHeight /></View></View>
        <View className="list"><Text className="label-name">建议价格:</Text><View className="label"><Input onInput={this.setPrice} type='number' /></View></View>
        <View className="list">
          <Text>藏品照片:</Text>
          <View className="label nobod">
            {showimages.map(item => {
              return (<View>
                <Image src={item} />
              </View>)
            })}
            <View onClick={this.upImage}>
              上传图片
              </View>
          </View>
        </View>
        <View className="list">
          <Text>藏品状态:</Text>
          <View className="label nobod">
            <RadioGroup onChange={this.setStatus}>
              {statusList.map((item, i) => {
                return (
                  <Label className='radio-list__label' for={i} >
                    <Radio className='radio-list__radio' value={item.key} checked={item.key==status}>{item.name}</Radio>
                  </Label>)
              })}
            </RadioGroup>
          </View>
        </View>
        <Button className="submit" onClick={this.summbit}>发布藏品</Button>
        <Navigator  url={`/pages/index/index`}> <Button className="submit">返回首页</Button></Navigator>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Issues as ComponentClass<PageOwnProps, PageState>
