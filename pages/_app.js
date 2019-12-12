import App, {Container} from 'next/app';
import Layout from "../components/layout";
import {Provider} from 'react-redux';
import 'antd/dist/antd.css';
import WidthRedux from '../lib/width-redux';

class MyApp extends App {

    static async getInitialProps(ctx) {
        const {Component} = ctx;
        let pageProps;

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        return {
            pageProps
        }
    }

    render() {
        const {Component, pageProps, reduxStore} = this.props;
        return (
            <Container>
                <Provider store={reduxStore}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </Provider>
            </Container>
        )
    }
}

export default WidthRedux(MyApp);
