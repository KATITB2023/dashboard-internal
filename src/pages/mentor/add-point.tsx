import React, { useState } from 'react';
import { AddPointComponent } from '~/components/mentor/add-point-component';
import Layout from '~/layout';
import { api } from '~/utils/api';

export default function AttendancePageAdmin() {
  return (
    <Layout title='Add Point Page'>
      <AddPointComponent />
    </Layout>
  );
}
