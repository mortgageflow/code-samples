import React, { useEffect, useState } from 'react';
import styles from './Inbox.module.scss';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import Router, { useRouter } from 'next/router';

import InputText from '../../../components/UI/InputText/InputText';
import Select from '../../../components/UI/Select/Select';
import { useAppSelector } from '../../../store/hooks';
import { format } from 'date-fns'
import InboxPreloader from './InboxPreloader/inboxPreloader';
import StatusOfNegotiation from '../../../components/StatusOfNegotiation/StatusOfNegotiation';
import { calculateHowMuchDaysLeftToAnswerOnThisOffer, convertDateWithTimeZoneOffset } from '../../../utils/utils';
import Link from 'next/link';
import cx from 'classnames';
import ReactPaginate from 'react-paginate';
import arrowDown from '../../../assets/images/icons/arrowDown.svg';
import { useDispatch } from 'react-redux';
import { loadNegotiationsOperation } from '../../../store/negotiation/negotiationOperations';
import paginationArrow from '../../../assets/images/icons/paginatioArrow.svg'
import { resetNegotiationState } from '../../../store/negotiation/negotiationReducer';


const schema = yup.object().shape({
    search: yup.string().required('Please enter your company'),
    status: yup.string().required('Please enter your industry'),
});


interface IFormData {
    status: string,
}


enum CreditorAnswerStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED',
    COUNTER_OFFERED = 'COUNTER_OFFERED',
    REQUEST_SOFP = 'REQUEST_SOFP',
}




const Inbox = () => {
    const dispatch = useDispatch();
    const { query, push } = useRouter();
    const { negotiations, isLoadingNegotiation, countOfPages } = useAppSelector(state => state.negotiation);


    const { handleSubmit,
        register,
        errors,
        watch,
        setError,
        setValue,
        trigger,
        clearErrors
    } = useForm<IFormData>({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        defaultValues: {
            status: query.status ? query.status as string : "",
        }
    });



    const formData = watch();
    const page = query.page ? parseInt(query.page as string) : 0


    useEffect(() => {
        dispatch(loadNegotiationsOperation(page, query.status as string))
    }, [page, query.status])




    let negotiationToDisplay = negotiations;


    const onPageChange = (page: { selected: number }) => {
        push({ pathname: '/main/inbox', query: { page: page.selected, status: query.status, search: query.search } })
    }



    return (
        <div className={styles.Inbox}>
            <h1 className={styles.Inbox__title}>Inbox</h1>

            <div className={styles.Inbox__filters}>
                <div className={styles.Inbox__select}>
                    <Select
                        arr={[
                            { label: "Needs review", value: "NEEDS_REVIEW" },
                            { label: "Viewed", value: "VIEWED" },
                            { label: "In progress", value: "PENDING" },
                            { label: "Accepted", value: "ACCEPTED" },
                            { label: "Declined ", value: "DECLINED" },
                            { label: "Expired ", value: "EXPIRED" },
                        ]}
                        placeholder='Status'
                        name='status'
                        error={errors.status?.message}
                        value={formData.status}
                        onChange={(value) => {
                            push({ pathname: '/main/inbox', query: { page: 0, status: value } })
                        }}
                        register={register}
                    />
                </div>
            </div>

            <table width="100%" className={styles.Table}>
                <thead className={styles.Table__header}>
                    <tr  >
                        <th className={styles.Table__title}>Negotiation</th>
                        <th className={styles.Table__title}>Debtor</th>
                        <th className={styles.Table__title}>Account number</th>
                        <th className={styles.Table__title}>Updated</th>
                        <th className={styles.Table__title}>Status</th>
                    </tr>

                </thead>

                <tbody>
                    {negotiationToDisplay && !isLoadingNegotiation && negotiationToDisplay.map(oneNegotiation => {
                        const { status } = oneNegotiation.creditorAnswer
                        const isNeedToShowNotificationText = status === "PENDING" || status === "EXPIRED";
                        const parsedDate = format(new Date(oneNegotiation.updatedAt ? oneNegotiation.updatedAt : oneNegotiation.dateOfCreation.date), 'dd/MM/yyyy');


                        let notificationText;

                        if (isNeedToShowNotificationText) {
                            const howMuchDaysLeft = calculateHowMuchDaysLeftToAnswerOnThisOffer(oneNegotiation)
                            notificationText = `${howMuchDaysLeft} days left`;
                        }

                        if (status === 'EXPIRED') { notificationText = `Deadline missed` };



                        return (
                            <tr
                                onClick={() => { Router.push(`/negotiation/${oneNegotiation._id}`) }}
                                key={oneNegotiation._id}
                                className={cx(styles.Table__item,
                                    { [styles.Table__item_new]: !oneNegotiation.creditorAnswer.isViewedByLender })
                                }
                            >
                                <td>{oneNegotiation.letterId.shortTitle}</td>
                                <td>{oneNegotiation.accountId?.debtorInformation?.firstName} {oneNegotiation.accountId?.debtorInformation?.lastName}</td>
                                <td>{oneNegotiation.accountId?.accountNumber}</td>
                                <td className={styles.Table__dateTd}>
                                    <span>{parsedDate}</span>
                                    {isNeedToShowNotificationText && <span className={styles.Table__notificationText}>{notificationText}</span>}
                                </td>
                                <td>
                                    <StatusOfNegotiation
                                        status={oneNegotiation.creditorAnswer.status}
                                        isViewed={oneNegotiation.creditorAnswer.isViewedByLender}
                                        isAcceptedByUser={oneNegotiation.creditorAnswer?.isAcceptedByUser}
                                    />
                                </td>

                            </tr>)
                    })}
                </tbody>

            </table>



            {/* if no negotiation to display by filters */}
            {!isLoadingNegotiation && negotiationToDisplay?.length === 0 && negotiations.length > 0 && <div className={styles.Notification}>
                <h2 className={styles.Notification__title} >We could not find it</h2>
                <p className={styles.Notification__text}>Please try to search other parameters or use another filter</p>
            </div>}

            {/* if no negotiation receive from server */}
            {!isLoadingNegotiation && negotiations?.length === 0 && <div className={styles.Notification}>
                <h2 className={styles.Notification__title} >You don’t have any negotiation yet</h2>
                <p className={styles.Notification__text}>You can <Link href="/main/debtors?page=1&select=all"><a className={styles.Notification__link}>upload the list</a></Link> with your debtors and invite them to negotiation
                    or just wait until your debtors will start one</p>
            </div>}

            {isLoadingNegotiation && <InboxPreloader />}

            {!isLoadingNegotiation && negotiations?.length > 0 && <div className={styles.Pagination}>
                <ReactPaginate
                    containerClassName={styles.Pagination__list}
                    pageLinkClassName={styles.Pagination__link}
                    activeLinkClassName={styles.Pagination__link_active}
                    pageClassName={styles.Pagination__item}
                    nextClassName={styles.Pagination__previous_link}
                    previousLabel={<img src={paginationArrow} alt="previous  butch of negotiation"></img>}
                    nextLabel={<img style={{ transform: "rotate(-180deg)" }} src={paginationArrow} alt="previous  butch of negotiation"></img>}


                    onPageChange={onPageChange}
                    pageCount={countOfPages ? parseInt(countOfPages) : 0}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={10}
                    initialPage={page}
                    disableInitialCallback={true}

                />
            </div>}
        </div>
    )
}

export default Inbox
