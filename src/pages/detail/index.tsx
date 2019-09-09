import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button, Text, Swiper, SwiperItem, ScrollView, Navigator} from '@tarojs/components'
import { connect } from '@tarojs/redux'

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

interface Detail {
  props: IProps;
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
}))
class Detail extends Component {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    constructor(){
      super()
      this.state ={
        isCollect:false,
        commentList:[
            {userName:'张三',avtorUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',speech:'哎呦，不错哦'},
            {userName:'张三',avtorUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',speech:'哎呦，不错哦'},
            {userName:'张三',avtorUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',speech:'哎呦，不错哦'},
            {userName:'张三',avtorUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',speech:'哎呦，不错哦'},
            {userName:'张三',avtorUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',speech:'哎呦，不错哦'}
        ],
        shopList:[
          {name:'麻痹戒指',imgUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',id:'1',type:'',data:'',attachType:''},
          {name:'麻痹戒指',imgUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',id:'2',type:''},
          {name:'麻痹戒指',imgUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',id:'3',type:''},
          {name:'麻痹戒指',imgUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',id:'4',type:''},
          {name:'麻痹戒指',imgUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',id:'5',type:''},
          {name:'麻痹戒指',imgUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',id:'6',type:''},
          {name:'麻痹戒指',imgUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',id:'7',type:''},
          {name:'麻痹戒指',imgUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',id:'8',type:''},
          {name:'麻痹戒指',imgUrl:'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg',id:'9',type:''},
        ]
      }
    }
    config: Config = {
    navigationBarTitleText: '藏品详情'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onShareAppMessage =()=>{
    return {
        title: '234',
        path: '/pages/default/index',
        imageUrl: 'https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg'
    }
  }
  setCollect=()=>{
    this.setState({
        isCollect:!this.state.isCollect
    })
  }

  render () {
    const {isCollect, commentList}=this.state
    return (
      <View className='index'>
        <Swiper
          className='test-h'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          interval={3000}
          indicatorDots
          autoplay>
          <SwiperItem>
          <Image src="https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg"></Image>
          </SwiperItem>
          <SwiperItem>
          <Image src="https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg"></Image>
          </SwiperItem>
          <SwiperItem>
          <Image src="https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg"></Image>
          </SwiperItem>
        </Swiper>
        <View>
            <View>藏品描述</View>
            <View>名称:麻痹戒指</View>
            <View>名称:颜色分类</View>
        </View>
        <View className="comment">
            <View className="comment-title">评论区</View>
            <View className="comment-list">
                {commentList.map(item=>{
                    return <View className="comment-item">
                        <View className="user-info">
                            <Image src={item.avtorUrl}/>
                            <Text>{item.userName}</Text>
                        </View>
                        <View className="user-speech">{item.speech}</View>
                    </View>
                })}
            </View>
            <View className="edit-speech">
                <Textarea style='background:#f1f0cf; width:90%;height:160px;padding:10px 30rpx;'/>
                <Button class="btn coll-btn" onClick={this.setCollect}>发表自己的评论</Button>
            </View>
        </View>
        <View className="bottom-tip">
            <View id="rotate">
                <View class={isCollect?"heart":'heart nocollect'} id="circle1"></View>
                <View class={isCollect?"heart":'heart nocollect'} id="square"></View>
                <View class={isCollect?"heart":'heart nocollect'} id="circle2"></View>
            </View>
            <Button class="btn coll-btn" onClick={this.setCollect}>{!isCollect?'点击收藏':'取消收藏'}</Button>
            <Button class="btn share-btn" open-type="share" onClick={this.onShareAppMessage}>找朋友围观</Button>
            <Button class="btn contact-btn" open-type="contact" send-message-path>询问相关信息</Button>
        </View>
        <Button class="contact-tip" open-type="contact" send-message-path>
            <Image src="https://lxt-block.oss-cn-beijing.aliyuncs.com/tmpImg/1567999499801.png"></Image>
        </Button>
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

export default Detail as ComponentClass<PageOwnProps, PageState>
