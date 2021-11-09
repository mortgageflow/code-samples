import React from 'react';
import styles from './DashboardLayout.module.scss';
import Navigation from '../../Navigation/Navigation';
import { FC } from 'react';
import AvatarAndName from '../../AvatarAndName/AvatarAndName';
import { useAppSelector } from '../../../store/hooks';


const DashboardLayout: FC = ({ children }) => {
    const { fullName, profileId: { name } } = useAppSelector(state => state.user)

    return (
        <div className={styles.DashBoardLayout}>
            <Navigation />

            <div className={styles.DashBoardLayout__content}>
                <div className={styles.DashBoardLayout__avatar}>
                    <AvatarAndName
                        name={fullName}
                        position={name}
                    />
                </div>
                <div className={styles.DashBoardLayout__wrapChildren}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default DashboardLayout
