import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout/DashboardLayout';
import PrivateRouter from '../../HOC/privateRouter';

import Inbox from '../../templates/main/InboxTemplate/InboxTemplate';

const inbox = () => {

    return (
        <DashboardLayout >
            <Inbox />
        </DashboardLayout>
    )
}

export default PrivateRouter(inbox)
