import React, { useRef, useState } from 'react';

import { Button, Upload, Table, Input, Modal, message } from 'antd'
import { EditOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

import * as XLSX from 'xlsx';
import ReactJson from 'react-json-view';

type IData = {
  en:string;
  de:string;
  es:string;
  fr:string;
  pt:string;
  key:number;
  id:number;
  name:string;
  [key:string]:any;
}

const ARRAY = ['here','ici','hier','qui','aqui','aquí para']

export const Update = () => {

  const [data, setData] = useState<IData[]>([])
  const [jsonData, setJsonData] = useState<any>({})
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const dataRef = useRef<any>({})
  const inputRef = useRef<any>({})

  const columns = [
    {
      title: '生成Key',
      width:100,
      dataIndex: '',
      key: '',
      render: (_: any, record: IData) => {
        return <Input onChange={(e) => { onChangeInput(e, _.id) }} />
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
        if(!getRenderConfig(record)){
          return null;
        }
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

  const updateChange = (info:any) => {
    let data: any[] = [];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(info.file);
    fileReader.onload = event => {
      try{
        const workbook = XLSX.read(event.target?.result,{type:'binary' })
        for(const sheet in workbook.Sheets){
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          }
        }
        let dataSource = data.map((item,index) => {
          return {
            ...item,
            key:index+1,
            id:index+1,
            name:''
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

    <Modal title="标签替换" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input onChange={(e) => { onChangeInput(e, 0) }} />
    </Modal>
  </div>
}