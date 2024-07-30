import React, { forwardRef } from "react";
import { styled } from '@mui/material/styles';
import { ListItemButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useKeyboard } from "../../hooks/useKeyboard";

const Item = styled(ListItemButton)`
  padding: 1.4em 0.7em;
  font-family: ${(props) => props.theme.sidebar.fontfamily};
  font-weight: bold
  border-radius:  0;
  
  &.${(props) => props.activeclassname} {
    background-color: #0d47a1;
    span {
      color: #1565c0;
    }
  }
`;

const CustomRouterLink = forwardRef((props, ref) => (
  <div ref={ref}>
    <NavLink {...props} />
  </div>
));

function SidebarItem({ href, Icon, disableCondition = false }) {

  const { disable_navigation } = useSelector((state) => state.navigation);
  const [showKeyboard, hideKeyboard] = useKeyboard();

  const handleMenuIconClick = () => {
    hideKeyboard();
  }

  return (
    <Item
      component={CustomRouterLink}
      to={href}
      activeclassname="active"
      sx={{ justifyContent: 'center' }}
      draggable={false}
      disabled={disable_navigation || disableCondition}
      onClick={handleMenuIconClick}
    >
      <Icon />
    </Item>
  )
}

export default SidebarItem
