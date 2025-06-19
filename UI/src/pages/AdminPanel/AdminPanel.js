import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Admin, Resource, Loading} from 'react-admin';
import { createTheme, ThemeProvider } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import Dashboard from './Dashboard'; 
import Layout from './Layout';
import dataProvider from './data/dataProvider';
import ProductList from './Product/ProductList';
import EditProduct from './Product/EditProduct';
import CreateProduct from './Product/CreateProduct'
import CategoryList from './Category/CategoryList'
import CategoryEdit from './Category/CategoryEdit'
import OrderList from './Order/OrderList'
import OrderEdit from './Order/OrderEdit'
import UserList from './User/UserList'
import UserEdit from './User/UserEdit'
import ProductIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import OrderIcon from '@mui/icons-material/Receipt';
import UserIcon from '@mui/icons-material/People';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
    background: { default: '#f4f6f8' },
  },
  typography: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 5 * 60 * 1000 } },
});

const AdminPanel = () => (
  <>
    <Toaster position="top-right" />
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <Admin
          dataProvider={dataProvider}
          basename="/admin"
          dashboard={Dashboard}
          loading={Loading}
          layout={Layout}
        >
          <Resource
            name="products"
            list={ProductList}
            edit={EditProduct}
            create={CreateProduct}
            icon={ProductIcon}
          />
          <Resource
            name="category"
            list={CategoryList}
            edit={CategoryEdit}
            icon={CategoryIcon}
          />
          <Resource
            name="order"
            list={OrderList}
            edit={OrderEdit}
            icon={OrderIcon}
          />
          <Resource
            name="user"
            list={UserList}
            edit={UserEdit}
            icon={UserIcon}
          />
        </Admin>
      </ThemeProvider>
    </QueryClientProvider>
  </>
);

export default AdminPanel;