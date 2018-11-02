import React, {Component} from "react";
import axios from "axios";
import "../styles/results.css";
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";

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

  transformData = (records = [], settings) => {
    records = records.sort((recordA, recordB) => moment(recordB.time).unix() - moment(recordA.time).unix());
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
    //const {classes} = this.props;
    return (
      <React.Fragment>
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable
            title={"List of measurments"}
            data={this.generateDataForGrid(gridData)}
            columns={["Date", "0-2", "2-4", "4-6", "6-8", "8-10", "10-12", "12-14", "14-16", "16-18", "18-20", "20-22", "22-24"]}
            options={{
              sort: false,
              filterType: "dropdown",
              selectableRows: false,
              responsive: "scroll"
            }}
          />
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

Results.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Results);
