
import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import './styles.scss'

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.05;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent > 0){
    return (
      <>
        <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      </>
    );
  }
  return null;

};

const getColors = (field, labelslist) => {
  let color = '#000';
  labelslist.forEach((item) => {
    if (item['field'] === field) {
      color = item.color;
    }
  })
  return color;
};

const CustomTooltip = ({ active, payload, labelslist }) => {
  if (active && labelslist && payload && payload.length) {
    let label = '';
    let color = '';
    labelslist.forEach((item) => {
      if (item['field'] === payload[0].name) {
        label = item.value;
        color = item.color;
      }
    })
    return (
      <div className="custom-tooltip">
        <p className="label" style={{ color: color }}>{`${label} : ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const renderColorfulLegendText = (value, entry) => {
  return <span style={{ color: '#131313' }}>{value}</span>;
};

class PieGraph extends PureComponent {

  render() {
    return (
      <PieChart width={250} height={250}>
        <Legend
          verticalAlign="bottom"
          payload={this.props.labelslist}
          wrapperStyle={{ fontSize: "10px" }}
          iconSize={12}
          formatter={renderColorfulLegendText}
        />
        <Pie
          data={this.props?.data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey={`${this.props.datakey}`}
        >
          {this.props.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getColors(entry?.name, this.props.labelslist)} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip labelslist={this.props.labelslist} />} />
        <Tooltip />
      </PieChart>
    );
  }
}

export default PieGraph;
