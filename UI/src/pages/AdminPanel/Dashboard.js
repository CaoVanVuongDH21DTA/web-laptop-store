import { useQuery } from '@tanstack/react-query';
import { useDataProvider, useRedirect } from 'react-admin';
import { useMemo } from 'react';
import { Box, Grid, Typography, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, BarElement, ArcElement, PointElement, LinearScale, CategoryScale, Filler, Legend, Title, Tooltip } from 'chart.js';

// Register Chart.js plugins
ChartJS.register(LineElement, BarElement, ArcElement, PointElement, LinearScale, CategoryScale, Filler, Legend, Title, Tooltip);

const StyledCard = ({ children, ...props }) => (
  <Card sx={{ boxShadow: 3, cursor: 'pointer', '&:hover': { boxShadow: 6 } }} {...props}>
    {children}
  </Card>
);

const Dashboard = () => {
  const dataProvider = useDataProvider();
  const redirect = useRedirect();

  // Fetch data with react-query
  const { data: orderResponse, isLoading: orderLoading, error: orderError } = useQuery({
    queryKey: ['order', { pagination: { page: 1, perPage: 50 } }],
    queryFn: () => dataProvider.getList('order', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'orderDate', order: 'DESC' },
      filter: {},
    }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: userResponse, isLoading: userLoading } = useQuery({
    queryKey: ['user', { pagination: { page: 1, perPage: 10 } }],
    queryFn: () => dataProvider.getList('user', {
      pagination: { page: 1, perPage: 10 },
      sort: { field: 'email', order: 'ASC' },
      filter: { enabled: true },
    }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ['products', { pagination: { page: 1, perPage: 50 } }],
    queryFn: () => dataProvider.getList('products', {
      pagination: { page: 1, perPage: 50 },
      sort: { field: 'name', order: 'ASC' },
      filter: { enabled: true },
    }),
    staleTime: 5 * 60 * 1000,
  });

  // Compute metrics
  const metrics = useMemo(() => {
    if (!orderResponse || !userResponse || !productsResponse) return {
      totalRevenue: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
    };

    const totalRevenue = orderResponse.data.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    return {
      totalRevenue,
      totalOrders: orderResponse.total || 0,
      totalUsers: userResponse.total || 0,
      totalProducts: productsResponse.total || 0,
    };
  }, [orderResponse, userResponse, productsResponse]);

  // Compute chart data
  const { revenueData, orderData, topProducts, topBrand } = useMemo(() => {
    if (!orderResponse || !productsResponse) return {
      revenueData: Array(12).fill(0),
      orderData: Array(12).fill(0),
      topProducts: [],
      topBrand: null,
    };

    const monthlyRevenue = Array(12).fill(0);
    const monthlyOrders = Array(12).fill(0);
    const productSales = {};
    const brandSales = {};

    orderResponse.data.forEach(order => {
      const orderDate = new Date(order.orderDate);
      const monthIndex = orderDate.getMonth();
      monthlyRevenue[monthIndex] += order.totalAmount || 0;
      monthlyOrders[monthIndex] += 1;

      // order.orderItemList?.forEach(item => {
      //   const productId = item.product?.id;
      //   const brandName = item.product?.categoryBrand?.name || 'Unknown';
      //   productSales[productId] = (productSales[productId] || 0) + item.quantity;
      //   brandSales[brandName] = (brandSales[brandName] || 0) + item.quantity;
      // });

      order.orderItemList?.forEach(item => {
        const productId = item.product?.id;

        // Product sales
        productSales[productId] = (productSales[productId] || 0) + item.quantity;

        // Brand sales
        const fullProduct = productsResponse.data.find(p => p.id === productId);
        const brandName = fullProduct?.categoryBrandName;
        if (!brandName) return; // Không cộng vào "Unknown"
        brandSales[brandName] = (brandSales[brandName] || 0) + item.quantity;
      });

    });

    const topProductsData = Object.entries(productSales)
      .map(([productId, quantity]) => {
        const product = productsResponse.data.find(p => p.id === productId);
        return { name: product?.name || 'Unknown', quantity };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const sortedBrands = Object.entries(brandSales).sort((a, b) => b[1] - a[1]);
    const topBrandData = sortedBrands.length > 0 ? { name: sortedBrands[0][0], quantity: sortedBrands[0][1] } : null;

    return { revenueData: monthlyRevenue, orderData: monthlyOrders, topProducts: topProductsData, topBrand: topBrandData };
  }, [orderResponse, productsResponse]);

  // Chart data
  const revenueChartData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Revenue',
      data: revenueData,
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  }), [revenueData]);

  const orderChartData = useMemo(() => ({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Orders',
      data: orderData,
      backgroundColor: '#f50057',
    }],
  }), [orderData]);

  const topProductsChartData = useMemo(() => ({
    labels: topProducts.map(p => p.name),
    datasets: [{
      label: 'Quantity Sold',
      data: topProducts.map(p => p.quantity),
      backgroundColor: ['#1976d2', '#f50057', '#388e3c', '#fbc02d', '#7b1fa2'],
    }],
  }), [topProducts]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Revenue') {
              return `$${context.parsed.y.toLocaleString()}`;
            }
            return `${context.parsed.y} ${context.dataset.label.toLowerCase()}`;
          },
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
      x: { title: { display: true, text: 'Month' } },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Top 5 Products by Sales' },
      tooltip: {
        callbacks: { label: (context) => `${context.label}: ${context.parsed} units` },
      },
    },
  };

  if (orderLoading || userLoading || productsLoading) {
    return <Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>;
  }

  if (orderError) {
    return <Box sx={{ padding: 3 }}><Alert severity="error">{orderError.message || 'Failed to load data'}</Alert></Box>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: 'background.default' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 500, mb: 4 }}>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard onClick={() => redirect('/admin/revenue')}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Total Revenue</Typography>
              <Typography variant="h4" color="primary">${metrics.totalRevenue.toLocaleString()}</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard onClick={() => redirect('/admin/order')}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Total Orders</Typography>
              <Typography variant="h4" color="primary">{metrics.totalOrders}</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard onClick={() => redirect('/admin/user')}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Total Users</Typography>
              <Typography variant="h4" color="primary">{metrics.totalUsers}</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard onClick={() => redirect('/admin/products')}>
            <CardContent>
              <Typography variant="h6" color="textSecondary">Total Products</Typography>
              <Typography variant="h4" color="primary">{metrics.totalProducts}</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Revenue Trend</Typography>
              <Line data={revenueChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'Monthly Revenue' } }, scales: { ...chartOptions.scales, y: { title: { display: true, text: 'Revenue ($)' } } } }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Order Trend</Typography>
              <Bar data={orderChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: true, text: 'Monthly Orders' } }, scales: { ...chartOptions.scales, y: { title: { display: true, text: 'Orders' } } } }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top 5 Products</Typography>
              <Pie data={topProductsChartData} options={pieChartOptions} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6">Top Brand</Typography>
              {topBrand ? (
                <Typography variant="h4" color="primary">
                  {topBrand.name} ({topBrand.quantity} Sản phẩm)
                </Typography>
              ) : (
                <Typography variant="body1">Không có dữ liệu thương hiệu</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;