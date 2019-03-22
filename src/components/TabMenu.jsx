import React from "react";
import PropTypes from "prop-types";
import {
  UncontrolledButtonDropdown as Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const defaultHandler = (action, item) => () => {
  console.log(action, item);
};
const TabMenu = ({
  children,
  active,
  item,
  onManage = defaultHandler,
  onDelete = defaultHandler
}) => (
  <Dropdown style={{ display: "flex" }}>
    {children}
    <DropdownToggle
      color={active ? "accent" : "secondary"}
      style={{
        flex: "unset",
        padding: 0,
        margin: "0 .25rem 0 0",
        transition: "none"
      }}
      caret
    />
    <DropdownMenu
      right
      modifiers={{ preventOverflow: { boundariesElement: "window" } }}
      positionFixed={true}
    >
      <DropdownItem onClick={defaultHandler("manage", item)}>
        Manage...
      </DropdownItem>
      <DropdownItem onClick={defaultHandler("manage", item)}>
        Set Color
      </DropdownItem>
      <DropdownItem onClick={defaultHandler("delete", item)}>
        Delete
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
);

TabMenu.propTypes = {
  active: PropTypes.bool,
  item: PropTypes.any,
  children: PropTypes.any,
  onManage: PropTypes.func,
  onDelete: PropTypes.func
};

export default TabMenu;
