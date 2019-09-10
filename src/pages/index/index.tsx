import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Button, Text, Swiper, SwiperItem, ScrollView, Navigator} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '../../actions/counter'
import Cloud from '../../utils/util'

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

interface Index {
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
class Index extends Component {
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
        cloud :new Cloud('shop-mqydt','goods'),
        list:[
          {name:'女装',key:'nv'},
          {name:'包包',key:'nv'},
          {name:'首饰',key:'nv'},
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
    navigationBarTitleText: '惠子家'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  componentDidMount(){
    const {cloud} = this.state
    cloud.getData({}).then(res=>{
        this.setState({
          shopList:res.data
        })
    })
  }

  onScrollToUpper = (e) => {
   console.log(e.detail)
  }
  
  onScroll(e){
    console.log(e.detail)
  }
  render () {
    const {list, shopList} =this.state
    const scrollStyle = {
      height: '30px'
    }
    const scrollTop = 0
    const Threshold = 20
    const vStyle = {
      height: '150px',
      display:'inline-block',
      'text-align':'center',
      width:'100px',
    }
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
            <Navigator url={`/pages/detail/index?id=`}><Image src="https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg"></Image></Navigator>
          </SwiperItem>
          <SwiperItem>
          <Image src="https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg"></Image>
          </SwiperItem>
          <SwiperItem>
          <Image src="https://i.loli.net/2019/09/09/xvPQ15qjmbdFgGf.jpg"></Image>
          </SwiperItem>
        </Swiper>
        <ScrollView
          scrollX
          scrollWithAnimation
          scrollTop={scrollTop}
          style={scrollStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
          onScrollToUpper={this.onScrollToUpper} 
          onScroll={this.onScroll}
        >
          {list.map(item=>{
            return <View style={vStyle} >{item.name}</View>
          })}
        </ScrollView>
        <View className="shop-list">
          {shopList.map(item=>{
            return <Navigator className="shop-item" url={`/pages/detail/index?id=${item._id}`}>
              <Image src={item.images[0]}></Image>
              <Text>{item.name}</Text>
            </Navigator>
          })}
        </View>
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

export default Index as ComponentClass<PageOwnProps, PageState>
