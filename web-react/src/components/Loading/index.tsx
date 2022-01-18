import loading from './loading.gif';

interface LoadingProps {
    showSpinner: boolean;
}

const LoadingIndicator = (props: LoadingProps) => (
    <div>
        {
            props.showSpinner &&
            <div className='cover'>
                <div className='modal'>
                    <h1>Loading...</h1>
                    <img src={loading} alt="Loading animation" />
                </div>
            </div>
        }
    </div>
)

export default LoadingIndicator;