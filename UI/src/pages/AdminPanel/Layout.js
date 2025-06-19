import { memo } from 'react';
import { Layout as RaLayout, Sidebar, Menu, MenuItemLink, useLogout } from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { Box,MenuItem } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ProductIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import OrderIcon from '@mui/icons-material/Receipt';
import UserIcon from '@mui/icons-material/People';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/ExitToApp';


const CustomSidebar = memo(() => {
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    logout('/login'); // hoặc navigate('/login') nếu bạn tự redirect
  };

  return (
    <Sidebar>
      <Menu>
        <MenuItemLink to="/" primaryText="Trang Chủ" leftIcon={<HomeIcon />} />
        <MenuItemLink to="/admin" primaryText="Dashboard" leftIcon={<DashboardIcon />} />
        <MenuItemLink to="/admin/products" primaryText="Products" leftIcon={<ProductIcon />} />
        <MenuItemLink to="/admin/category" primaryText="Categories" leftIcon={<CategoryIcon />} />
        <MenuItemLink to="/admin/order" primaryText="Orders" leftIcon={<OrderIcon />} />
        <MenuItemLink to="/admin/user" primaryText="Users" leftIcon={<UserIcon />} />
        
        {/* 🔐 Logout custom */}
        <MenuItem onClick={handleLogout}>
          <LogoutIcon style={{ marginRight: 8 }} />
          Đăng xuất
        </MenuItem>
      </Menu>
    </Sidebar>
  );
});

const Layout = (props) => (
  <RaLayout {...props} sidebar={CustomSidebar}>
    <Box sx={{ padding: 2, backgroundColor: 'background.default', minHeight: 'inherit' }}>
      <Box>{props.children}</Box>
    </Box>
  </RaLayout>
);

export default memo(Layout);