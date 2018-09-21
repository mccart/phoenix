import { createProperty, updateProperty } from "./properties";
import { createGeometry, updateGeometry } from "./geometries";
import { updateWhen } from "./common";
import {
  createPropertyColumn,
  createGeometryColumn
} from "../columns/Constants";
import _ from "lodash";

const defaultEntity = {
  id: undefined,
  label: undefined,
  geometries: {},
  properties: {},
  history: [],
  when: {
    start: undefined,
    end: undefined,
    type: "Interval"
  }
};

export const createEntity = (def = defaultEntity) => ({
  ...def,
  when: { ...def.when }
});
export const updateEntity = (e, updates, fields) => {
  const entity = updates.reduce((entity, update) => {
    if (!entity.id) entity.id = update.id;
    if (!entity.label) entity.label = update.label;

    if (update.properties) {
      //TODO: Do more testing of this. Right now, it seems like the "cheap" version
      //(having a latest state and an array of old updates) isn't significantly better
      //I left the code here in case we want to go back to trying it
      //entity.history.push(update.properties)
      //entity.properties = { ...entity.properties, ...update.properties }

      let updatedProperties = _.reduce(
        update.properties,
        (updatedProperties, update, field) => {
          const { value, time } = update;
          const prop = updatedProperties[field]
            ? updatedProperties[field]
            : createProperty(entity.properties[field]);
          updatedProperties[field] = updateProperty(prop, value, time);
          updateWhen(entity, time);
          if (!fields.properties[field])
            createPropertyColumn(fields.properties, field, value);
          return updatedProperties;
        },
        {}
      );
      entity.properties = { ...entity.properties, ...updatedProperties };
    }
    if (update.geometries) {
      let updatedGeometries = _.reduce(
        update.geometries,
        (updatedGeometries, update, field) => {
          const prop = updatedGeometries[field]
            ? updatedGeometries[field]
            : createGeometry(entity.geometries[field]);
          updatedGeometries[field] = updateGeometry(prop, update);
          updateWhen(entity, update.when.end || update.when.start);
          if (!fields.properties[field])
            createGeometryColumn(fields.geometries, field, update);
          return updatedGeometries;
        },
        {}
      );
      entity.geometries = { ...entity.geometries, ...updatedGeometries };
    }

    return entity;
  }, createEntity(e));
  return [entity, fields];
};
