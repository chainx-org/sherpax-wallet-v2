import React, {useEffect, useMemo, useState} from 'react'
import {ITotalBalance} from "@polkadot/react-hooks/useAssetsBalance";
import { Pie,G2 } from '@ant-design/plots';
import {LabelHelp} from "@polkadot/react-components";


interface Props  {
  totalBalance:ITotalBalance[]
}

const AssetAllocation = ({totalBalance}: Props) => {
  const [targetData,setTargetData] = useState([])

  const { registerTheme } = G2;
  registerTheme('custom-theme', {
    colors10: [
      '#6097ff',
      '#a7caf9',
      '#f3d541',
      '#59cf95',
      '#f159ac',
      '#afb4bc',
    ],
  });


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
    innerRadius: 0.55,
    label: false,
    nodeCfg:{
      type:'circle',
      padding:100,
    },
    //点击的状态
    interactions: [
      // {
      //   type: 'element-selected',
      // },
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
        formatter: (text:any,record:any) => {
          const item = targetData.filter(d => d.coin === record.value)
          return `${(item[0].percent*100).toFixed(2)} % `;
        },
      },
      itemName:{
        style:{
          fill:'rgba(78, 78, 78, .64)'
        }
      }
    },
    pieStyle: {
      lineWidth: 0,
    },
    //自定义状态
    state: {
      active: {
        style: {
          lineWidth: 0,
          fillOpacity: 0.65,
        },
      },
    },
    //自定义主题
    theme:'custom-theme'
  };

  return (
    <div className="assetAllocation">
      <div className="chart-tit">
        Asset Allocation
        <LabelHelp
          className="tips"
          help={'Asset Allocation = The display of each asset in account (sorted by each asset\'s latest market value)'}
          icon={'circle-question'}
        />
      </div>
      {useMemo(() => <Pie {...config} />,[targetData])}

    </div>
  )
}

export default  AssetAllocation
