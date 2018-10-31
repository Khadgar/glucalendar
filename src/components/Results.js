import React, {Component} from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import "../styles/results.css";
var moment = require("moment");

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: undefined,
      records: undefined,
      user: this.props.user
    };
  }

  groupBy = (list = [], keyGetter) => {
    const map = new Map();
    list.forEach(item => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  };

  generateGrid = data => {
    const rows = [];
    let rowCount = 0;
    for (let resultGroupKey of data.keys()) {
      rows.push(
        <div className={"gridRow row_" + rowCount} key={"row_" + rowCount}>
          <div className="rowName">
            <Typography variant="h6" gutterBottom>
              {resultGroupKey}
            </Typography>
          </div>
          {this.generateResultColumn(data, resultGroupKey)}
        </div>
      );
      rowCount++;
    }
    return rows;
  };

  generateResultColumn = (data, id) => {
    const columns = [];
    const indexes = data.get(id).map((result, i) => {
      return {pos: Math.floor(result.time.hour() / 2), index: i};
    });
    for (let i = 0; i < 12; i++) {
      if (indexes.find(el => el.pos === i)) {
        let result = data.get(id)[indexes.find(el => el.pos === i).index];
        columns.push(
          <div className={"gridCol col_" + i} key={"col_" + i}>
            <div className="resultColumn">
              <Typography variant="subtitle1" gutterBottom>
                {result.result}
              </Typography>
            </div>
          </div>
        );
      } else {
        columns.push(
          <div className={"gridCol col_" + i} key={"col_" + i}>
            <div className="emptyColumn" />
          </div>
        );
      }
    }
    return columns;
  };

  generateHeader = () => {
    return (
      <div className={"gridRow headerRow"}>
        <div className="rowName">
          <Typography variant="h6" gutterBottom>
            Dates
          </Typography>
        </div>
        {this.generateHeaderColumnNames()}
      </div>
    );
  };

  generateHeaderColumnNames = () => {
    const columnNames = [];
    for (let i = 0; i < 12; i++) {
      columnNames.push(
        <div className={"gridCol gridHeaderNames"} key={i}>
          <div className="resultColumn">
            <Typography variant="h6" gutterBottom>
              {i * 2}-{i * 2 + 2}
            </Typography>
          </div>
        </div>
      );
    }
    return columnNames;
  };

  transformData = (records = [], settings) => {
    records = records.sort((recordA, recordB) => moment(recordA.time).unix() - moment(recordB.time).unix());
    let resultGroups = this.groupBy(records, record => moment(record.time).format("ll"));
    for (let resultGroupKey of resultGroups.keys()) {
      let mappedValues = resultGroups.get(resultGroupKey).map(group => {
        return {
          note: group.note,
          result: Number(group.result),
          time: moment(group.time)
        };
      });
      resultGroups.set(resultGroupKey, mappedValues);
    }
    return resultGroups;
  };

  fetchData = () => {
    axios
      .post("/user/get-records", {
        // then get the records
        username: this.state.user.username
      })
      .then(response => {
        if (response.status === 200) {
          this.setState(response.data);
        }
      })
      .catch(error => {
        console.log("Getting user data error", error);
      });
  };

  componentDidMount() {
    this.fetchData();
  }

  render() {
    const gridData = this.transformData(this.state.records, this.state.settings);
    return (
      <React.Fragment>
        {this.generateHeader()}
        {this.generateGrid(gridData)}
      </React.Fragment>
    );
  }
}
export default Results;
