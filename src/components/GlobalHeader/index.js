import React from 'react'
import { Menu, Popover, Icon,Avatar} from 'antd'
import Link from 'umi/link'
import classnames from 'classnames'
import Container from '@/components/Container'
import style from './index.less'
import logo from '@/assets/logo.svg'
import TopSearch from '../TopSearch'

class GlobalHeader extends React.PureComponent{
    render (){
        const {me,onUserMenuClick,onActionMenuClick , location } = this.props
        
        const userMenu = (
            <div className={style['user-menu']}>
                {me ? 
                <div className={classnames(style['user-info'],'clearfix')}>
                    <span className={style['user-info-name']}>{me.name}</span>
                    <span className={style['user-info-login']}>{me.login}</span>
                </div> : null
                }
                <Menu onClick={onUserMenuClick}>
                    <Menu.Divider />
                    <Menu.Item key="userCenter"><Icon type="user" />个人中心</Menu.Item>
                    <Menu.Item key="userSetting"><Icon type="setting" />账户设置</Menu.Item>
                    <Menu.Item key="userDraft"><Icon type="appstore" />草稿箱</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
                </Menu>
            </div>
        )
        
        const editMenu = (
            <Menu onClick={onActionMenuClick}>
              <Menu.Item key="question"><Icon type="question" />提问</Menu.Item>
              <Menu.Item key="article"><Icon type="setting" />写文章</Menu.Item>
            </Menu>
        )
        return (
            <header className={style.header}>
                <Container mode={this.props.mode}>
                    <React.Fragment>
                        <div className={style.logo}>
                            <a href="/"><img src={logo} alt="" /></a>
                        </div>
                        <nav className={style.nav}>
                            <Link to="/">首页</Link>
                            <Link to="/question">问答</Link>
                            <Link to="/article">文章</Link>
                            <Link to="/column">专栏</Link>
                            <Link to="/tag">标签</Link>
                            <TopSearch defaultValue={location ? location.query.q : ""} />
                        </nav>
                        <div className={style.user}>
                        {
                            me ? (
                                <div className={style.action}>
                                    <div className={classnames(style.item,"itellyou-popover itellyou-popover-menu ")}>
                                        <Popover 
                                        content={editMenu}
                                        getPopupContainer={
                                            node => node.parentNode
                                        }
                                        >
                                            <div><Icon type="plus" /></div>
                                        </Popover>
                                    </div>
                                    <div className={style.item}>
                                        <Icon type="bell" />
                                    </div>
                                    <div className={classnames(style.item,"itellyou-popover itellyou-popover-menu ")}>
                                        <Popover 
                                        content={userMenu} 
                                        getPopupContainer={
                                            node => node.parentNode
                                        }
                                        placement="bottomRight"
                                        >
                                            <div><Avatar src={me.avatar} size={24}/></div>
                                        </Popover>
                                    </div>
                                </div>
                            )
                            : (
                                <div>
                                    <a href="/user/login">登录</a>
                                    <a href="/user/register">注册</a>
                                </div>
                            )
                        }
                        </div>
                    </React.Fragment>
                </Container>
            </header>
        )
    }
}

export default GlobalHeader;