import React from "react";
import PropTypes from "prop-types";
import BooleanQueryBuilder from "../../components/BooleanQueryBuilder";
import gql from "graphql-tag";
import * as fetch from "cross-fetch";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

const uri = "http://localhost:4000/graphql";
const wsUri = "ws://localhost:4000/subscriptions";

const httpLink = new HttpLink({ uri, fetch });
const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

function toGql(query) {
  let { type, rules, groups, field, op, values } = query;
  let parsed;
  let terms = [];
  if (rules) terms = terms.concat(rules.map(toGql));
  if (groups) terms = terms.concat(groups.map(toGql));
  terms = terms.filter(Boolean);
  if (type === "and") {
    parsed = terms.join(",");
    return parsed.length ? `{and:[${parsed}]}` : "";
  }
  if (type === "or") {
    parsed = terms.join(",");
    return parsed.length ? `{or:[${parsed}]}` : "";
  }
  if (field && op) {
    field = field.field;
    if (op === "exists") {
      return `{field: ${field}, op: ${op}}`;
    } else if (values) {
      let value = `[${values.map(v => `"${v}"`)}]`;
      return `{field: ${field}, op: ${op}, values: ${value}}`;
    }
  }
  return "";
}
let aircraftFields = [
  "ModeS",
  "FirstCreated",
  "LastModified",
  "ModeSCountry",
  "Country",
  "Registration",
  "Manufacturer",
  "ICAOTypeCode",
  "Type",
  "SerialNo",
  "RegisteredOwners",
  "Interested",
  "UserTag"
];
let aircraftTypeFields = [
  "Icao",
  "WakeTurbulence",
  "Species",
  "EngineType",
  "EnginePlacement",
  "Engines",
  "Model",
  "Manufacturer"
];
let aircraftOptions = aircraftFields.map(f => ({ headerName: f, field: f }));
let aircraftTypeOptions = aircraftTypeFields.map(f => ({
  headerName: f,
  field: f
}));
const defaultQuery = () => ({ type: "and", rules: [], groups: [] });
class AdsbQueryForm extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };
  componentDidMount = () => {
    this.props.onChange({
      data: defaultQuery(),
      acft: defaultQuery(),
      acftType: defaultQuery()
    });
  };
  handleFormChange = field => value => {
    let searchTerms = toGql(value);
    console.log(searchTerms);
    if (searchTerms.length > 0) {
      const countQuery = gql`
        query {
          aircraftCount(query: ${searchTerms})
        }
      `;

      let results = client
        .query({
          query: countQuery
        })
        .then(d => console.log(d.data.aircraftCount))
        .catch(e => console.error(e))
        .finally(d => console.log(d));
      console.log(results);
    }
    let data = { ...this.props.data, [field]: value };
    this.props.onChange(data);
  };
  handleDataChange = this.handleFormChange("data");
  handleAcftChange = this.handleFormChange("acft");
  handleAcftTypeChange = this.handleFormChange("acftType");
  render() {
    let { onChange, data, ...props } = this.props;
    let { handleDataChange, handleAcftChange, handleAcftTypeChange } = this;
    return (
      <div>
        <h4>Mode-S Data</h4>
        {data.data && (
          <BooleanQueryBuilder
            fields={aircraftOptions}
            group={data.data}
            onChange={handleDataChange}
            {...props}
          />
        )}
        <h4>Aircraft Information</h4>
        {data.acft && (
          <BooleanQueryBuilder
            fields={aircraftOptions}
            group={data.acft}
            onChange={handleAcftChange}
            {...props}
          />
        )}
        <h4>Aircraft Type Information</h4>
        {data.acftType && (
          <BooleanQueryBuilder
            fields={aircraftTypeOptions}
            group={data.acftType}
            onChange={handleAcftTypeChange}
            {...props}
          />
        )}
      </div>
    );
  }
}

export default AdsbQueryForm;
