import React from 'react'
import ContentLoader, { Facebook } from 'react-content-loader'

const InboxPreloader = () => {
    return (
        <>
            <ContentLoader width={"100%"} height={"500px"} >
                <rect x="0" y="10" rx="4" ry="4" width="100%" height="40" />
                <rect x="0" y="60" rx="3" ry="3" width="100%" height="40" />
                <rect x="0" y="110" rx="3" ry="3" width="100%" height="40" />
                <rect x="0" y="160" rx="3" ry="3" width="100%" height="40" />
                <rect x="0" y="210" rx="3" ry="3" width="100%" height="40" />
                <rect x="0" y="260" rx="3" ry="3" width="100%" height="40" />
                <rect x="0" y="310" rx="3" ry="3" width="100%" height="40" />
                <rect x="0" y="360" rx="3" ry="3" width="100%" height="40" />
                <rect x="0" y="410" rx="3" ry="3" width="100%" height="40" />
                <rect x="0" y="460" rx="3" ry="3" width="100%" height="40" />
            </ContentLoader>
        </>
    )
}

export default InboxPreloader
