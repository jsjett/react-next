import initialStore from "../store/store";
import React from 'react';
const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';


function getOrCreateStore(initialState) {
    if(isServer){
        return initialStore(initialState);
    }

    if(!window[__NEXT_REDUX_STORE__]){
        window[__NEXT_REDUX_STORE__] = initialStore(initialState);
    }

    return window[__NEXT_REDUX_STORE__];
}


export default (Comp) => {
    class WidthRedux extends React.Component{
        constructor(props){
            super(props);
            this.reduxStore = getOrCreateStore(props.initialReduxState);
        }

        static async getInitialProps (ctx) {
            // 将用户信息注入的session
            let reduxStore = {};
            if(isServer){
                const {req} = ctx.ctx;
                const {session} = req;
                if(session && session.userInfo){
                    reduxStore=getOrCreateStore({
                        userInfo:session.userInfo
                    });
                }else {
                    reduxStore = getOrCreateStore();
                }
            }else {
                reduxStore = getOrCreateStore();
            }

            ctx.reduxStore = reduxStore;
            let appProps = {};

            if(typeof Comp.getInitialProps === 'function'){
                appProps = await Comp.getInitialProps(ctx);
            }
            return {
                ...appProps,
                initialReduxState: reduxStore.getState()
            }
        }

        render(){
            const {Component,pageProps,...rest} = this.props;

            return <Comp Component={Component}
                         pageProps={pageProps}
                         {...rest}
                         reduxStore={this.reduxStore} />
        }
    }

    return WidthRedux

}
