import Mock from 'mockjs'

import './appeal/index'

Mock.mock(/myprojcet\/index/, (req, res) => {
  return {
    code: '200',
    msg: '成功'
  }
})

Mock.setup({
  timeout: '500-100'
})
