import React, { useRef, useState } from 'react';

import { Button, Upload, Table, Input, Modal, message, Tabs, Tag } from 'antd'
import { EditOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

import * as XLSX from 'xlsx';
import ReactJson from 'react-json-view';

const { TabPane } = Tabs;

type DefaultDataType = {
  en:string;
  de:string;
  es:string;
  fr:string;
  pt:string;
  it:string;
}

type IData = DefaultDataType & {
  key:number;
  id:number;
  name:string;
  [key:string]:any;
}

type InputDataType = {
  id:number;
  value:string;
}

type CustomizeType = { id:number, title:keyof DefaultDataType,input:InputDataType[] }

const ARRAY = ['here','ici','hier','qui','aqui','aquí para']

export const Update = () => {
  const [data, setData] = useState<IData[]>([])
  const [jsonData, setJsonData] = useState<any>({})
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [tabKey, setTabKey] = useState<number>(1)
  // eslint-disable-next-line
  const [customizeData, setCustomizeData] = useState<CustomizeType[]>([
    {
      id:1,
      title:'en',
      input:[
        {
          id:1,
          value:''
        }
      ],
    },
    {
      id:2,
      title:'fr',
      input:[
        {
          id:1,
          value:``
        }
      ],
    },
    {
      id:3,
      title:'pt',
      input:[
        {
          id:1,
          value:''
        }
      ],
    },
    {
      id:4,
      title:'it',
      input:[
        {
          id:1,
          value:''
        }
      ],
    },
    {
      id:5,
      title:'de',
      input:[
        {
          id:1,
          value:''
        }
      ],
    },
    {
      id:6,
      title:'es',
      input:[
        {
          id:1,
          value:''
        }
      ],
    }
  ])

  const dataRef = useRef<any>({})
  const inputRef = useRef<any>({})
  const customizeDataRef = useRef<any>(customizeData)

  const columns = [
    {
      title: '生成Key',
      width:100,
      dataIndex: '',
      key: '',
      render: (_: any, record: IData) => {
        return <Input defaultValue={record.name} onChange={(e) => { onChangeInput(e, _.id) }} />
      }
    },
    {
      title: 'en',
      dataIndex: 'en',
      key: 'en',
      render: (_:string) => {
        return <span dangerouslySetInnerHTML={{__html: _}}></span>
      }
    },
    {
      title: 'fr',
      dataIndex: 'fr',
      key: 'fr',
      render: (_:string) => {
        return <span dangerouslySetInnerHTML={{__html: _}}></span>
      }
    },
    {
      title: 'pt',
      dataIndex: 'pt',
      key: 'pt',
      render: (_:string) => {
        return <span dangerouslySetInnerHTML={{__html: _}}></span>
      }
    },
    {
      title: 'it',
      dataIndex: 'it',
      key: 'it',
      render: (_:string) => {
        return <span dangerouslySetInnerHTML={{__html: _}}></span>
      }
    },
    {
      title: 'de',
      dataIndex: 'de',
      key: 'de',
      render: (_:string) => {
        return <span dangerouslySetInnerHTML={{__html: _}}></span>
      }
    },
    {
      title: 'es',
      dataIndex: 'es',
      key: 'es',
      render: (_:string) => {
        return <span dangerouslySetInnerHTML={{__html: _}}></span>
      }
    },
    {
      title:'配置',
      dataIndex: 'config',
      key:'config',
      width:80,
      render: (_: any, record: IData) => {
        // if(!getRenderConfig(record)){
        //   return null;
        // }
        return <div onClick={() => {
          dataRef.current = record;
          setIsModalVisible(true) 
        }}><EditOutlined /></div>
      }
    }
  ];

  const onChangeInput = (e:React.ChangeEvent<HTMLInputElement>, id:number) => {
    if(!id){
      //说明是替换
      inputRef.current = e.target?.value.trim()
      return
    }
    let dataSource = data.map(item => {
      if(item.id === id){
        return {
          ...item,
          name: e.target?.value.trim()
        }
      }else{
        return item
      }
    })
    setData(dataSource)
  }

  const onChangeInputCustom = (e:React.ChangeEvent<HTMLInputElement>, id:number, inputId:number) => {
    let newReplaceRef = customizeDataRef.current.map((item:CustomizeType) => {
      if(item.id === id){
        return {
          ...item,
          input: item.input.map((inputItem:InputDataType) => {
            if(inputItem.id === inputId){
              return {
                ...inputItem,
                value:e.target?.value.trim()
              }
            }else{
              return inputItem
            }
          })
        }
      }else{
        return item
      }
    })
    customizeDataRef.current = newReplaceRef;
  }

  const updateChange = (info:any) => {
    let data: any[] = [];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(info.file);
    fileReader.onload = event => {
      try{
        const workbook = XLSX.read(event.target?.result,{type:'binary' })
        for(const sheet in workbook.Sheets){
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            let result = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
            let newData = result.map((item:any) => {
              return {
                ...item,
                name:item.key || ''
              }
            })
            data = data.concat(newData);
          }
        }
        let dataSource = data.map((item,index) => {
          return {
            ...item,
            key:index+1,
            id:index+1,
          }
        })
        setData(dataSource)
      }catch(e){
        throw new Error('error')
      }
    }
  }

  const updateProps: UploadProps = {
    name: 'file',
    beforeUpload:() => {
      return false
    },
    onChange:updateChange,
  };

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  
  const getRenderConfig = (record:IData):Boolean => {
    let {id,key,name, ...reset} = record
    var flags = false;
    for(let key in reset){
      // eslint-disable-next-line
      ARRAY.forEach(item => {
        let Reg = new RegExp("\\b"+item+"\\b",'g')
        if(Reg.test(reset[key])){
          flags = true;
        }
      })
    }
    return flags
  }

  const handleOk = () => {
    let {id,key,name, ...reset} = dataRef.current

    if(tabKey === 1){
      if(JSON.stringify(inputRef.current) === '{}'){
        message.error('缺少替换链接')
        return 
      }

      if(!getRenderConfig(reset)){
        message.error('找不到替换的内容')
        return
      }

      let newReplace:any = {}

      inputRef.current = inputRef.current.replace(/>.*</g,'><')
      
      for(let key in reset){
        ARRAY.forEach(item => {
          let Reg = new RegExp("\\b"+item+"\\b",'g')
          if(Reg.test(reset[key])){
            if(/<\/a>/.test(reset[key])){
              let newText = reset[key].replace(/<a.*\/a>/, item)
              let text = inputRef.current.replace('><',`>${item}<`)
              newReplace[key] = newText.replace(item, text)
            }else{
              let text = inputRef.current.replace('><',`>${item}<`)
              newReplace[key] = reset[key].replace(item, text)
            }
          }
        })
      }

      let replaceData = data.map(item => {
        if(id === item.id){
          return {
            ...newReplace,
            id:id,
            key:key,
            name:name
          }
        }else{
          return item
        }
      })

      setData(replaceData)
      setIsModalVisible(false)
      inputRef.current = {}
    }

    if(tabKey === 2){
      if(JSON.stringify(inputRef.current) === '{}'){
        message.error('缺少替换链接')
        return 
      }

      var newReplace:any = {}
      var checkKey:any = {}
      customizeDataRef.current.forEach((element:CustomizeType) => {
        let value = reset[element.title];
        element.input.forEach((inputElement: InputDataType) => {
          if(/<\/a>/.test(value)){
            if(!inputElement.value){
              checkKey[element.title] = 1;
              return 
            }
            let newText = value.replace(/<a.*">/, '').replace(/<\/a>/,'')
            let checkValueReg = new RegExp("\\b"+inputElement.value+"\\b",'g')
            if(checkValueReg.test(newText)){
              let Reg = new RegExp("\\b"+inputElement.value+"\\b",'g')
              let text = inputRef.current.replace('><',`>${inputElement.value}<`)
              let textRep = newText.replace(Reg, text);
              newReplace[element.title] = textRep
            }else{
              checkKey[element.title] = 1;
            }
          }else{
            if(!inputElement.value){
              checkKey[element.title] = 1;
              return 
            }
            let checkValueReg = new RegExp("\\b"+inputElement.value+"\\b",'g')
            if(checkValueReg.test(value)){
              let Reg = new RegExp("\\b"+inputElement.value+"\\b",'g')
              let text = inputRef.current.replace('><',`>${inputElement.value}<`)
              let newText = value.replace(Reg, text);
              newReplace[element.title] = newText
            }else{
              checkKey[element.title] = 1;
            }
          }
        })
      });

      if(JSON.stringify(checkKey) !== "{}"){
        Object.keys(checkKey).forEach(item => {
          message.error(`检测到${item}匹配不到自定义key`)
        })
        return
      }

      let replaceData = data.map(item => {
        if(id === item.id){
          return {
            ...newReplace,
            id:id,
            key:key,
            name:name
          }
        }else{
          return item
        }
      })

      setData(replaceData)
      setIsModalVisible(false)
      inputRef.current = {}
    }

  }

  const generate = () => {

    //检测一下是不是有key为空的情况
    let isKeyEmpty;
    data.forEach(item => {
      if(!item.name){
        isKeyEmpty = true
      }
    })

    if(isKeyEmpty){
      message.error('key不能为空')
      return
    }

    var obj:any = {}
    data.forEach(item => {
      const {id,name,key, ...reset} = item
      Object.keys(reset).forEach(itemKey => {
        obj[itemKey] = {}
      })
    })

    for(let key in obj){
      data.forEach(item2 => {
        for(let key1 in item2){
          if(key === key1){
            obj[key][item2.name] = item2[key1]
          }
        }
      })
    }

    setJsonData(obj)

  }

  const propsVal = {
    name: 'source',
    src: { jsonData },
    indentWidth: 10,
    displayDataTypes: false,
    displayObjectSize: true
  }

  return <div>
    <Upload {...updateProps} fileList={[]}>
      <Button type="primary">Click to Upload</Button>
    </Upload>
    
    <Table dataSource={data} columns={columns} pagination={false}></Table>

    <Button onClick={generate} type="primary">生成</Button>

    <div style={{}}>
      <ReactJson {...propsVal} />
    </div>

    <Modal title="替换规则" destroyOnClose={true} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tabs defaultActiveKey={String(tabKey)} onChange={(key) => { setTabKey(Number(key)) }}>
          <TabPane tab="a标签替换【默认】" key="1">
            <Input onChange={(e) => { onChangeInput(e, 0) }} />
          </TabPane>
          <TabPane tab="自定义替换规则" key="2">
            {
              customizeDataRef.current.map((item:any) => {
                return <div key={item.id}>
                  <div style={{marginBottom:10, marginTop:10}}><Tag color="#108ee9">{item.title}</Tag></div>
                  {
                    item.input.map((inputItem:any) => {
                      return <Input key={inputItem.id} onChange={(e) => { onChangeInputCustom(e, item.id, inputItem.id) }} />
                    })
                  }
                </div>
              })
            }
            <p style={{marginTop:10}}>替换链接</p>
            <Input onChange={(e) => { onChangeInput(e, 0) }} />
          </TabPane>
        </Tabs>
    </Modal>
  </div>
}