import React,{useMemo} from 'react'
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
      position: 'right',
      offsetX: -60,
      itemWidth:150,
      itemValue:{
        alignRight:true,
        formatter: (text,record) => {
          const item = totalBalance.filter(d => d.coin === record.value)
          return `${(item[0].percent*100).toFixed(2)} % `;
        },
      },
    }
  };

  return (
    <div className="assetAllocation">
      <div className="chart-tit">Asset Allocation</div>
      {useMemo(() => <Pie {...config} />,[totalBalance])}

    </div>
  )
}

export default  AssetAllocation
