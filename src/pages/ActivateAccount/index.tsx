import styles from "./index.module.css";
import ActivatePassword from './ActivatePassword'
const Activate =()=>{
    return (
      <>
        <div className={styles['style-back-to-page']}>
            <h1>Activate account</h1>
        </div>
        <div className={styles.wrapper}>
            <ActivatePassword />
        </div>
      </>

    )
}
export default Activate