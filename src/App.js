import React from 'react';

import Layout from './layout/Layout';
import JobsAPITester from './containers/JobsAPITester/JobsAPITester';

const App = () => {
  return (
    <Layout>
      <JobsAPITester />
    </Layout>
  );
}

export default App;
