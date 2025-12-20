import { Layout } from 'antd';
import { 
  Skeleton, 
  SkeletonCircle, 
  SkeletonMenu, 
  SkeletonStatCard, 
  SkeletonTable 
} from './Skeleton';

const { Header, Sider, Content } = Layout;

export const DashboardSkeleton = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider width={250} style={{ background: '#001529', padding: '16px' }}>
        <Skeleton 
          width="100%" 
          height="32px" 
          marginBottom="32px"
          variant="dark"
        />
        <SkeletonMenu items={6} variant="dark" />
      </Sider>

      <Layout>
        {/* Header */}
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Skeleton width="200px" height="32px" />
          <SkeletonCircle size="40px" />
        </Header>

        {/* Content */}
        <Content style={{ margin: '24px 16px' }}>
          <Skeleton width="300px" height="32px" marginBottom="24px" />
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px', 
            marginBottom: '24px' 
          }}>
            {[1, 2, 3, 4].map(i => <SkeletonStatCard key={i} />)}
          </div>

          <SkeletonTable rows={5} columns={4} />
        </Content>
      </Layout>
    </Layout>
  );
};