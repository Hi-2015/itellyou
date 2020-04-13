import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Link, history, useDispatch, useSelector } from 'umi';
import { Card, Avatar, Menu } from 'antd';
import Loading from '@/components/Loading';
import styles from './index.less';
import menus from './menu';
import { UserStar } from '@/components/User';
import Container, { Layout } from '@/components/Container';
import DocumentTitle from 'react-document-title';

export default ({ id, paths }) => {
    const menuKey = paths && paths.length > 1 ? paths[1] : 'activity';
    if (!menus.find(menu => menu.key === menuKey)) history.push('/404');
    const dispatch = useDispatch();
    const settings = useSelector(state => state.settings);
    useEffect(() => {
        dispatch({
            type: 'user/find',
            payload: {
                id,
            },
        });
    }, [dispatch, id]);

    const detail = useSelector(state => state.user.detail[id]);

    if (!detail) return <Loading />;

    const { avatar, name, description, star_count, follower_count, profession, address } = detail;
    const menu = menus.find(item => item.key === menuKey);
    return (
        <DocumentTitle title={`${detail.name} - ${settings.title}`}>
            <Container>
                <Layout spans={8}>
                    <Card bordered className={styles['info-card']}>
                        <div className={styles['info-head']}>
                            <Avatar
                                src={avatar || 'http://cdn-object.itellyou.com/avatar/default.png'}
                                size={96}
                            />
                            <h2>{name}</h2>
                            <p className={styles['description']}>{description}</p>
                        </div>
                        <div className={styles['info-follow']}>
                            <div>
                                <UserStar
                                    className={styles['btn']}
                                    id={id}
                                    use_star={detail.use_star}
                                />
                            </div>
                            <div className={styles['info']}>
                                <Link to="followings">
                                    <p>关注了</p>
                                    <p className={styles['count']}>{star_count}</p>
                                </Link>
                                <div className={styles['split']}></div>
                                <Link to="follower">
                                    <p>关注者</p>
                                    <p className={styles['count']}>{follower_count}</p>
                                </Link>
                            </div>
                        </div>
                        <div className={styles['info-detail']}>
                            <p>地址:{address || '未填写'}</p>
                            <p>行业:{profession || '未填写'}</p>
                        </div>
                    </Card>
                    <Card
                        className={styles['content-card']}
                        title={
                            <Menu mode="horizontal" defaultSelectedKeys={menuKey}>
                                {menus.map(({ key, title }) => (
                                    <Menu.Item
                                        key={key}
                                        className={classNames({ active: key === menuKey })}
                                    >
                                        <Link to={`/${paths[0]}/${key}`}>{title}</Link>
                                    </Menu.Item>
                                ))}
                            </Menu>
                        }
                    >
                        <menu.component id={id} />
                    </Card>
                </Layout>
            </Container>
        </DocumentTitle>
    );
};