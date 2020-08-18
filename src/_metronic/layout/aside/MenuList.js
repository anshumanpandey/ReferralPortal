import React from "react";
import MenuSection from "./MenuSection";
import MenuItemSeparator from "./MenuItemSeparator";
import MenuItem from "./MenuItem";
import { connect } from "react-redux";

class MenuList extends React.Component {
  render() {
    const { currentUrl, menuConfig, layoutConfig, user } = this.props;

    return menuConfig.aside.items
    .filter(item => {
      if (!item.roles) {
        return true
      } else {
        return item.roles.includes(user.role)
      }
    })
    .map((child, index) => {
      return (
          <React.Fragment key={`menuList${index}`}>
            {child.section && <MenuSection item={child} />}
            {child.separator && <MenuItemSeparator item={child} />}
            {child.title && (
                <MenuItem
                    item={child}
                    currentUrl={currentUrl}
                    layoutConfig={layoutConfig}
                />
            )}
          </React.Fragment>
      );
    });
  }
}

const mapStateToProps = ({ auth: { user } }) => ({
  user
});

export default connect(mapStateToProps)(MenuList);
