import Mock from 'mockjs'
import qs from 'qs'

// 查询订单
Mock.mock(/appeal\/queryOrders/, (req, res) => {
  return {
    code: '200',
    msg: '该订单未在淘粉吧使用',
    orderStatus: '9'
  }
})

function CreateRecordItem() {
  return Mock.mock({
    appealDate: Mock.Random.date('yyyy.MM.dd'),
    goodNumber: Mock.Random.id(),
    goodTitle: Mock.Random.ctitle(18, 30),
    'appealStatus|1': ['申诉成功', '申诉失败', '客服审核中'],
    appealDec: Mock.Random.ctitle(8, 18)
  })
}
function CreateOrderRecord(i) {
  return Mock.mock({
    recordList: function() {
      let result = []
      while (i--) {
        result.push(CreateRecordItem())
      }
      return result
    }
  })
}

// 订单记录
Mock.mock(/appeal\/orderRecord/, (req, res) => {
  let pageNo = qs.parse(req.body).pageNo
  let CreateRecord =
    pageNo === '1' ? CreateOrderRecord(6) : CreateOrderRecord(3)
  let resData = Object.assign(
    {
      code: '200',
      msg: '请求成功'
    },
    CreateRecord
  )
  return resData
})

// 上传订单图片
Mock.mock(/appeal\/uploadImg/, (req, res) => {
  return {
    code: '200',
    msg: '请求成功',
    imgUrl: 'https://y.taofen8.com/6eb2d96fb6c64afe93823514fd70131f.jpg'
  }
})

// 人工审核
Mock.mock(/appeal\/manualAudit/, (req, res) => {
  return {
    code: '200',
    msg: '请求成功'
  }
})
