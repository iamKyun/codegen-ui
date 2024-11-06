import datePic from '@/assets/element/date.png'
import inputPic from '@/assets/element/input.png'
import numberPic from '@/assets/element/number.png'
import radioPic from '@/assets/element/radio-group.png'
import selectPic from '@/assets/element/select.png'
import textareaPic from '@/assets/element/textarea.png'
import attachmentPic from '@/assets/element/attachment.png'
import passwordPic from '@/assets/element/password.png'

export const searchElements = [
  {label: '文本框', value: 'text', pic: inputPic},
  {label: '数字框', value: 'number', pic: numberPic},
  {label: '日期选择', value: 'date', pic: datePic},
  {label: '单选按钮', value: 'radio', pic: radioPic},
  {label: '下拉选择', value: 'select', pic: selectPic},
]

export const formElements = [
  {label: '文本框', value: 'text', pic: inputPic},
  {label: '大文本框', value: 'textarea', pic: textareaPic},
  {label: '密码框', value: 'password', pic: passwordPic},
  {label: '数字框', value: 'number', pic: numberPic},
  {label: '日期选择', value: 'date', pic: datePic},
  {label: '单选按钮', value: 'radio', pic: radioPic},
  {label: '下拉选择', value: 'select', pic: selectPic},
  {label: '文件上传', value: 'attachment', pic: attachmentPic},
]

export const tableElements = [
  {label: '文本', value: 'text'},
  {label: '日期', value: 'date'},
  {label: '字典', value: 'dict'},
]

export const exampleOptions = [
  {
    label: '选项一',
    value: '1',
  },
  {
    label: '选项二',
    value: '2',
  },
]
