import React, {useEffect, useMemo, useState} from 'react'
import {ITotalBalance} from "@polkadot/react-hooks/useAssetsBalance";
import { Pie } from '@ant-design/plots';


interface Props  {
  totalBalance:ITotalBalance[]
}

const AssetAllocation = ({totalBalance}: Props) => {
  const [targetData,setTargetData] = useState([])


  useEffect(() => {
    const firstFive = totalBalance.slice(0,5)
    let otherData = totalBalance.slice(5,totalBalance.length).reduce((prev:ITotalBalance,current:ITotalBalance) => {
      return {
        coin:'Others',
        dollar: prev.dollar + current.dollar,
        percent: prev.percent + current.percent
      }
    },{dollar:0,percent:0})

    if(firstFive.length > 1) {
      setTargetData([...firstFive,otherData])
    }

  },[totalBalance])


  const config = {
    appendPadding: 5,
    autoFit:true,
    width:400,
    height:170,
    data:targetData,
    angleField: 'dollar',
    colorField: 'coin',
    radius: 1,
    innerRadius: 0.6,
    label: false,
    nodeCfg:{
      type:'circle',
      padding:100,
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: false,
      },
    },
    legend: {
      position: 'right',
      offsetX: -60,
      itemWidth:150,
      itemValue:{
        alignRight:true,
        formatter: (text,record) => {
          const item = targetData.filter(d => d.coin === record.value)
          return `${(item[0].percent*100).toFixed(2)} % `;
        },
      },
    }
  };

  return (
    <div className="assetAllocation">
      <div className="chart-tit">Asset Allocation</div>
      {useMemo(() => <Pie {...config} />,[targetData])}

    </div>
  )
}

export default  AssetAllocation
