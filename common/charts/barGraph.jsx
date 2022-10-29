import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label } from 'recharts';
import './styles.scss'

const getMapedLabels = (field, labelslist) => {
  // eslint-disable-next-line array-callback-return
  let label = labelslist.filter((v) => {
    if(v.field === field){
        return v;
    }
  })[0].value;
  return label;
}

const CustomTooltip = ({ active, payload, label, labelslist}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-title"><span>Date : </span>{`${label}`}</p>
        {
          payload.map(v => (
            <p
              key={`${v.name}_${v.value}`}
              className="tooltip-label"
              style={{ color: v.fill }}
            >
              {`${getMapedLabels(v.name, labelslist)} : ${v.value}`}
            </p>
          ))
        }
      </div>
    );
  }

  return null;
};

const renderColorfulLegendText = (value, entry) => {
  return <span style={{ color: '#131313' }}>{value}</span>;
};

class BarGraph extends PureComponent {

  render() {
    if (this.props?.data?.length <= 0) {
      return (
        <h5 className='no-data-text'>No data found. Please select another time period.</h5>
      )
    }
    return (
        <BarChart
          width={window.innerWidth-60}
          height={280}
          data={this.props.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <Legend
            verticalAlign="bottom"
            payload={this.props.labelslist}
            wrapperStyle={{fontSize: "10px", bottom: "-16px"}}
            iconSize={12}
            formatter={renderColorfulLegendText}
          />
          <XAxis dataKey={`${this.props.Xdatakey}`}>
            <Label value="Date" offset={0} position="insideBottom" />
          </XAxis>
          <YAxis label={{ value: 'Cases', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip labelslist={this.props.labelslist}/>} />
          {
            this.props.labelslist.map(v => (
              <Bar key={`${v.field}`} dataKey={`${v.field}`} fill={`${v.color}`} />
            ))
          }
        </BarChart>
    );
  }
}

export default BarGraph;
