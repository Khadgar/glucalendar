import React, {Component} from "react";
import axios from "axios";
import "../styles/results.css";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

var moment = require("moment");

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 2,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  body: {
    fontSize: 14
  }
});

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: undefined,
      records: undefined,
      user: this.props.user
    };
  }

  columns = [
    {
      name: "Dates"
    },
    {
      name: "0-2",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "2-4",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "4-6",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "6-8",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "8-10",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "10-12",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "12-14",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "14-16",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "16-18",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "18-20",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "20-22",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    },
    {
      name: "22-24",
      options: {
        customBodyRender: (value, tableMeta) => {
          return this.resultColFormatter(value);
        }
      }
    }
  ];

  resultColFormatter = result => {
    return (
      <Tooltip title={`Note: ${result.note}`}>
        <div className={`resultCol ${result.eval}`}>{result.value}</div>
      </Tooltip>
    );
  };

  getMuiTheme = () =>
    createMuiTheme({
      typography: {
        useNextVariants: true
      },
      overrides: {
        MuiTableCell: {
          root: {
            padding: "4px 12px 4px 12px"
          }
        }
      }
    });

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

  generateDataForGrid = data => {
    const gridData = [];

    for (let resultGroupKey of data.keys()) {
      const rowItem = [];
      rowItem.push(resultGroupKey);

      const indexes = data.get(resultGroupKey).map((result, i) => {
        return {pos: Math.floor(result.time.hour() / 2), index: i};
      });
      for (let i = 0; i < 12; i++) {
        if (indexes.find(el => el.pos === i)) {
          let result = data.get(resultGroupKey)[indexes.find(el => el.pos === i).index];
          rowItem.push(result.result);
        } else {
          rowItem.push(0);
        }
      }
      gridData.push(rowItem);
    }
    return gridData;
  };

  evalResult = (note, result, settings) => {
    let evaluation = "OK";
    switch (note) {
      case "fasting":
        if (result < settings.target_fasting.range.min || result > settings.target_fasting.range.max) {
          evaluation = "NOK";
        }
        break;
      case "after lunch":
        if (result < settings.target_after_meal.range.min || result > settings.target_after_meal.range.max) {
          evaluation = "NOK";
        }
        break;
      case "before lunch":
        if (result < settings.target_before_meal.range.min || result > settings.target_before_meal.range.max) {
          evaluation = "NOK";
        }
        break;
      case "after meal":
        if (result < settings.target_after_meal.range.min || result > settings.target_after_meal.range.max) {
          evaluation = "NOK";
        }
        break;
      case "before meal":
        if (result < settings.target_before_meal.range.min || result > settings.target_before_meal.range.max) {
          evaluation = "NOK";
        }
        break;
      default:
        break;
    }
    return evaluation;
  };

  transformData = (records = [], settings) => {
    records = records.sort((recordA, recordB) => moment(recordB.time).unix() - moment(recordA.time).unix());
    let resultGroups = this.groupBy(records, record => moment(record.time).format("ll"));
    for (let resultGroupKey of resultGroups.keys()) {
      let mappedValues = resultGroups
        .get(resultGroupKey)
        .map(group => {
          return {
            note: group.note,
            result: {
              value: Number(group.result),
              note: group.note,
              eval: this.evalResult(group.note, Number(group.result), settings[0])
            },
            time: moment(group.time)
          };
        })
        .sort((a, b) => b.time.unix() - a.time.unix());
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
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <div className="dataGrid">
            <MUIDataTable
              title={"List of measurments"}
              data={this.generateDataForGrid(gridData)}
              columns={this.columns}
              options={{
                sort: false,
                filterType: "dropdown",
                selectableRows: false,
                responsive: "scroll"
              }}
            />
          </div>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

Results.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Results);
