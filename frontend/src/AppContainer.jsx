import { useSelector, useDispatch } from 'react-redux'
import { selectNotify, hideNotify, showNotify } from './redux/reducers/notify.js'
import { selectAppLoading, hideAppLoading, showAppLoading } from './redux/reducers/appLoading.js'
import { selectVendors, setVendors } from './redux/reducers/vendorSlice.js'
import App from './App'
import LoadingPage from './components/LoadingPage/index.jsx'
import { Toast } from '@shopify/polaris'

function AppContainer(props) {
  const dispatch = useDispatch()

  const appLoading = useSelector(selectAppLoading)
  const notify = useSelector(selectNotify)
  const vendors = useSelector(selectVendors)

  const reduxState = { appLoading, notify, vendors }
  const reduxActions = {
    showAppLoading: () => dispatch(showAppLoading()),
    hideAppLoading: () => dispatch(hideAppLoading()),

    showNotify: (notify) => dispatch(showNotify(notify)),
    hideNotify: () => dispatch(hideNotify()),

    setVendors: (data) => dispatch(setVendors(data)),
  }

  const appProps = {
    ...props,
    ...reduxState,
    actions: reduxActions,
  }

  const toastMarkup = notify?.show && (
    <Toast
      error={notify.error}
      content={notify.message}
      onDismiss={() => {
        if (notify.onDismiss) {
          notify.onDismiss()
        }
        dispatch(hideNotify())
      }}
    />
  )

  return (
    <div>
      <App {...appProps} />

      {appLoading?.loading && <LoadingPage />}

      {toastMarkup}
    </div>
  )
}

export default AppContainer
