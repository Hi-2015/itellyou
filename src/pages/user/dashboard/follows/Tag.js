import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, Link } from 'umi';
import { Table, Button } from 'antd';
import Loading from '@/components/Loading';
import Timer from '@/components/Timer';

const fetchList = (dispatch, offset, limit, parmas) => {
    return dispatch({
        type: 'tagStar/list',
        payload: {
            append: offset > 0,
            offset,
            limit,
            ...parmas,
        },
    });
};

const FollowsTag = () => {
    const [page, setPage] = useState(1);
    const limit = 20;
    const [followLoading, setFollowLoading] = useState({});

    const dispatch = useDispatch();
    const dataSource = useSelector(state => (state.tagStar ? state.tagStar.list : null));
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['tagStar/list'];

    const renderPage = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a>上一页</a>;
        }
        if (type === 'next') {
            return <a>下一页</a>;
        }
        return originalElement;
    };

    const onStar = (id, name, use_star) => {
        setFollowLoading(loading => {
            return {
                ...loading,
                [id]: true,
            };
        });

        const type = use_star === false ? 'follow' : 'unfollow';
        dispatch({
            type: `tagStar/${type}`,
            payload: {
                id,
                name,
            },
        }).then(() => {
            setFollowLoading(loading => {
                return {
                    ...loading,
                    [id]: false,
                };
            });
        });
    };

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            render: (_, { tag: { id, name } }) => {
                return (
                    <Link className="table-column-title" to={`/tag/${id}`}>
                        {name}
                    </Link>
                );
            },
        },
        {
            title: '关注时间',
            dataIndex: 'created_time',
            key: 'created_time',
            width: 120,
            render: (text, { tag: { use_star } }) => {
                if (use_star === false) return;
                return <Timer time={text} />;
            },
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: 120,
            render: (_, { tag: { id, name, use_star } }) => {
                if (use_star === false) {
                    return (
                        <Button
                            loading={followLoading[id]}
                            onClick={() => onStar(id, name, use_star)}
                        >
                            关注
                        </Button>
                    );
                }
                return (
                    <Button loading={followLoading[id]} onClick={() => onStar(id, name, use_star)}>
                        取消关注
                    </Button>
                );
            },
        },
    ];

    const renderTable = () => {
        if (!dataSource) return <Loading />;
        return (
            <Loading loading={loading}>
                <Table
                    rowKey={row => row.tag.id}
                    columns={columns}
                    dataSource={dataSource.data}
                    pagination={{
                        onChange: page => {
                            setPage(page);
                            fetchList(dispatch, (page - 1) * limit, limit);
                        },
                        current: page,
                        itemRender: renderPage,
                        hideOnSinglePage: true,
                        pageSize: limit,
                        total: dataSource ? dataSource.total : 0,
                    }}
                />
            </Loading>
        );
    };

    return renderTable();
};

FollowsTag.getInitialProps = async ({ isServer, store, params }) => {
    const { dispatch, getState } = store;
    await fetchList(dispatch, 0, 20, params);
    if (isServer) return getState();
};

export default FollowsTag;
