import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    userName: '@first',
    'status|1': ['normal', 'freeze'],
    createTime: +Mock.Random.date('T'),
    ecashBalance: '199.9912'
  }))
}

const groupList = []
groupList.push([{
  id: 1,
  groupName: '普通用户',
  tranferFee: '0',
  collectionFee: '0.08%',
  buyCoinFee: '0',
  sellCoinFee: '0.08%'
}, {
  id: 2,
  groupName: '普通承兑人',
  tranferFee: '0',
  collectionFee: '0',
  buyCoinFee: '0',
  sellCoinFee: '0.08%'
}, {
  id: 1,
  groupName: '高级承兑人',
  tranferFee: '0',
  collectionFee: '0.08%',
  buyCoinFee: '0',
  sellCoinFee: '0.08%'
}])

// 订单管理
const orderlist = []
const ordercount = 100
for (let i = 0; i < ordercount; i++) {
  orderlist.push(Mock.mock({
    id: '@increment',
    'type|1': ['buy', 'sell'],
    'status|1': ['payment', 'paymented', 'completed', 'cancle', 'complaint'],
    userName: '@first',
    acceptor: '@last',
    num: '100.00',
    price: '100.00',
    turnover: '680.00',
    orderTime: +Mock.Random.date('T')
  }))
}

// 申诉管理
const complaintList = []
const complaintcount = 100
for (let i = 0; i < complaintcount; i++) {
  complaintList.push(Mock.mock({
    userName: '@first',
    'type|1': ['normal', 'freeze'],
    'reason|1': ['notpay', 'non-release', 'fraud', 'other'],
    phonenumber: '18146615142',
    id: '@increment',
    complaintTime: +Mock.Random.date('T'),
    'status|1': ['process', 'processing', 'processed']
  }))
}

// 承兑人申请
const appAcceptorList = []
const appAcceptorCount = 100
for (let i = 0; i < appAcceptorCount; i++) {
  appAcceptorList.push(Mock.mock({
    nickname: '@first',
    username: '@first' + '@last',
    phonenumber: '18146615142',
    securityDeposit: '3000',
    acceptorname: '@first',
    'status|1': ['audit', 'pass', 'notpass'],
    appAcceptorTime: +Mock.Random.date('T'),
    'operation|1': ['btn', 'txt']
  }))
}
// 承兑人管理
const acceptorManageList = []
const acceptorManageCount = 100
for (let i = 0; i < acceptorManageCount; i++) {
  acceptorManageList.push(Mock.mock({
    nickname: '@first',
    acceptorname: '@first',
    eachBalance: '1239000.0000',
    ecashPaydeposit:'3000',
    'status|1': ['acceptance', 'notacceptance', 'trading'],
    tradenum: '300',
    username: '@first' + '@last',
    phonenumber: '18146615142'
  }))
}
// 账户管理
const accountManageList = []
const accountManageCount = 100
for (let i = 0; i < accountManageCount; i++) {
  accountManageList.push(Mock.mock({
    nickname: '@first',
    username: '@first' + '@last',
    'permissions|1': ['superManage', 'manage'],
    'status|1': ['enable', 'disable'],
    createTime: +Mock.Random.date('T'),
    'type|1': ['systemAccount', 'crruntAccount', 'btn']
  }))
}

export default {
  getList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getGroupList: () => {
    return groupList
  },

  getOrderList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)
    let mockList = orderlist.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })
    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  },

  getComplaintManageList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)
    let mockList = complaintList.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })
    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  },

  getAppAcceptorList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)
    let mockList = appAcceptorList.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })
    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  },
  getAcceptorManageList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)
    let mockList = acceptorManageList.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })
    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  },

  getAccountManageList: config => {
    const { importance, type, title, page = 1, limit = 20, sort } = param2Obj(config.url)
    let mockList = accountManageList.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })
    if (sort === '-id') {
      mockList = mockList.reverse()
    }
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  },

  getPv: () => ({
    pvData: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
  }),
  getArticle: (config) => {
    const { id } = param2Obj(config.url)
    for (const article of List) {
      if (article.id === +id) {
        return article
      }
    }
  },
  createArticle: () => ({
    data: 'success'
  }),
  updateArticle: () => ({
    data: 'success'
  })
}
