import React from 'react'
import {ITotalBalance} from "@polkadot/react-hooks/useAssetsBalance";
import { Pie } from '@ant-design/plots';


interface Props  {
  totalBalance:ITotalBalance[]
}

const AssetAllocation = ({totalBalance}: Props) => {

  const config = {
    appendPadding: 5,
    autoFit:true,
    width:400,
    height:170,
    data:totalBalance,
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
      // layout: 'horizontal',
      position: 'right',
      offsetX: -65,
      itemValue:{
        alignRight:true,
        formatter: (text) => {
          return '47.55%';
        },
      }
    }
  };

  return (
    <div className="assetAllocation">
      <div className="chart-tit">Asset Allocation</div>
      <Pie {...config} />
    </div>
  )
}

export default  AssetAllocation
