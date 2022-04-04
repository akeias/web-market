import { NextPage } from 'next'
import Link from 'next/link'
import { product } from '../../models/Product'
import styles from '../../styles/ItemList.module.css'

const Item: NextPage<{ data: product }> = ({ data }) => {
    return (
        <div>
            <div>
                <Link href={`/purchase?id=${data.id}`} passHref>
                    <div className={styles.lList}>
                        <img className={styles.imageUrl} src={data.imageUrl}></img>
                        <div className={styles.info}>
                            <div className={styles.name}>{data.name}</div>
                            <div className={styles.price}>{data.price}원</div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    )
}

const ItemList: NextPage<{ data: Array<product> }> = ({ data }) => {
    return (
        <div className={styles.style}>
            <div>
                <div className={styles.category}>{data[0].category1}</div>
            </div>
            <div className={styles.item}>
                {data.map(product => <Item data={product}></Item>)}
            </div>
        </div>
    )
}

export default ItemList